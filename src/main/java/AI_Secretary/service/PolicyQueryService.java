package AI_Secretary.service;

import AI_Secretary.DTO.SearchDTO.*;
import AI_Secretary.Exceptions.PolicyNotFoundException;
import AI_Secretary.domain.policyData.DocumentAiResult;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.policyData.PolicyRequiredDocument;
import AI_Secretary.domain.user.UserInterests;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.User.UserInterestsRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.search.*;
import AI_Secretary.repository.sideService.CalendarEventRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyQueryService {

    private final PolicyDataRepository policyDataRepository;
    private final PolicyBookmarkRepository policyBookmarkRepository;
    private final PolicyRequiredDocumentRepository policyRequiredDocumentRepository;
    private final PolicyCheckListRepository policyChecklistRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final DocumentAiResultRepository documentAiResultRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInterestsRepository userInterestsRepository;
    @Transactional(readOnly = true)
    public List<PolicySummaryDto> searchPolicies(String keyword) {
        return policyDataRepository.searchByKeyword(keyword)
                .stream()
                .map(this::toPolicySummaryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PolicySummaryDto> getRecommendedPolicies(Long userId, int limit) {

        // 1) 프로필 필수: 없으면 추천을 할 수 없으니 예외 처리 또는 빈 리스트
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필이 존재하지 않습니다. userId=" + userId));

        String regionCtpv = profile.getRegionCtpv(); // 시/도 단위 지역 코드

        // 2) 유저 관심 카테고리 코드 (user_interests 테이블)
        List<UserInterests> interests = userInterestsRepository.findByUser_Id(userId);
        Set<String> recommendedCategoryCodes = interests.stream()
                .map(i -> i.getCategory().getCode()) // ex) "HEALTH", "JOB", "LOCAL" ...
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new)); // 순서 유지 + 중복 제거

        // 3) 복지정보(welfareInfo) 기반으로 카테고리 코드 확장
        enrichCategoryCodesByWelfareInfo(profile, recommendedCategoryCodes);

        // JPA 쿼리 메서드 파라미터용 List
        List<String> categoryCodesParam = recommendedCategoryCodes.isEmpty()
                ? null          // null이면 "카테고리 조건 없이" 레포 쿼리하도록 설계 가능
                : new ArrayList<>(recommendedCategoryCodes);

        // 4) 레포지토리에서 후보 정책 조회 (지역 + 카테고리 기반 필터링)
        List<PolicyData> raw = policyDataRepository.findRecommendedForUser(
                regionCtpv,
                categoryCodesParam
        );

        // 5) 사용자 선호 카테고리 우선 정렬 + 마감일 기준 보조 정렬
        List<PolicyData> sorted = sortByPersonalPriority(raw, recommendedCategoryCodes);

        // 6) limit 만큼만 잘라서 DTO 변환
        return sorted.stream()
                .limit(limit)
                .map(this::toPolicySummaryDto)
                .toList();
    }
    private void enrichCategoryCodesByWelfareInfo(UserProfile profile, Set<String> codes) {
        if (profile == null) return;

        String incomeLevel = profile.getIncomeLevel();
        if ("basic".equalsIgnoreCase(incomeLevel) || "near".equalsIgnoreCase(incomeLevel)) {
            codes.add("FINANCE");
            codes.add("LOCAL");
        }

        if (Boolean.TRUE.equals(profile.getHasDisability())) {
            codes.add("SENIOR");
            codes.add("LOCAL");
        }

        if (Boolean.TRUE.equals(profile.getLivingAlone())) {
            codes.add("LOCAL");
        }

        if (profile.getAge() != null && profile.getAge() >= 65) {
            codes.add("SENIOR");
        }
    }

    private List<PolicyData> sortByPersonalPriority(List<PolicyData> list, Set<String> preferredCodes) {
        if (list == null || list.isEmpty()) return List.of();
        if (preferredCodes == null || preferredCodes.isEmpty()) {
            // 선호 카테고리가 없으면 endDate 기준으로만 정렬
            return list.stream()
                    .sorted(Comparator.comparing(
                            PolicyData::getEndDate,
                            Comparator.nullsLast(Comparator.naturalOrder())
                    ))
                    .toList();
        }

        return list.stream()
                .sorted((p1, p2) -> {
                    String c1 = p1.getMainCategory() != null ? p1.getMainCategory().getCode() : null;
                    String c2 = p2.getMainCategory() != null ? p2.getMainCategory().getCode() : null;

                    boolean pref1 = c1 != null && preferredCodes.contains(c1);
                    boolean pref2 = c2 != null && preferredCodes.contains(c2);

                    // 1순위: 선호 카테고리 여부
                    if (pref1 != pref2) {
                        return pref1 ? -1 : 1; // pref1이 true면 위로
                    }

                    // 2순위: 마감일(endDate) 오름차순 (null은 제일 뒤)
                    LocalDate e1 = p1.getEndDate();
                    LocalDate e2 = p2.getEndDate();
                    if (e1 == null && e2 == null) return 0;
                    if (e1 == null) return 1;
                    if (e2 == null) return -1;
                    return e1.compareTo(e2);
                })
                .toList();
    }

    public PolicyDetailResponse getPolicyDetail(Long policyId, Long userIdOrNull) {
        PolicyData policy = policyDataRepository
                .findByIdWithCategory(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // 1) 기본 정보 DTO
        PolicyBasicDto basicDto = mapToBasicDto(policy);

        // 2) AI 요약/쉬운 설명 (DocumentAiResult는 Document 기준이므로 policyId로 조회)
        DocumentAiResult aiResult = documentAiResultRepository
                .findTopByDocument_Policy_IdOrderByCreatedAtDesc(policyId)
                .orElse(null);
        PolicyAiDto aiDto = mapToAiDto(aiResult);

        // 3) 필수 서류 목록
        List<PolicyRequiredDocumentDto> docDtos =
                policyRequiredDocumentRepository
                        .findByPolicy_IdOrderBySortOrderAsc(policyId)
                        .stream()
                        .map(this::mapToRequiredDocumentDto)
                        .toList();

        // 4) 유저 컨텍스트 (북마크, 체크리스트, 일정)
        PolicyUserContextDto userContext = null;
        if (userIdOrNull != null) {
            boolean bookmarked =
                    policyBookmarkRepository.existsByUserIdAndPolicyId(userIdOrNull, policyId);

            boolean hasChecklist =
                    policyChecklistRepository.existsByUserIdAndPolicyId(userIdOrNull, policyId);

            LocalDate nearestEventDate =
                    calendarEventRepository
                            .findNearestDateByUserIdAndPolicyId(userIdOrNull, policyId)
                            .orElse(null);

            userContext = new PolicyUserContextDto(bookmarked, hasChecklist, nearestEventDate);
        }

        return new PolicyDetailResponse(
                basicDto,
                aiDto,
                docDtos,
                userContext
        );
    }

    // --------------------------------------------------------------------
    // DTO 매핑 로직
    // --------------------------------------------------------------------
    /**
     * 상세 기본 정보 DTO
     * 엔티티 구조에 맞게 필드를 매핑
     */
    private PolicyBasicDto mapToBasicDto(PolicyData p) {
        String applicationPeriod = buildApplicationPeriod(p.getStartDate(), p.getEndDate());

        return new PolicyBasicDto(
                p.getId(),
                p.getName(), // title
                p.getMainCategory() != null ? p.getMainCategory().getName() : null, // categoryName
                p.getDeptName(),    // provider (주관부처/기관)
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getSupportCycle(),   // supportType: 현재는 supportCycle을 매핑
                applicationPeriod,
                p.getLifeCycle(),      // targetDescription: lifeCycle을 임시로 사용
                p.getSummary(),        // summaryText
                p.getLastCrawledAt() != null ? p.getLastCrawledAt() : p.getLastModifiedAt()
        );
    }

    private String buildApplicationPeriod(LocalDate start, LocalDate end) {
        if (start == null && end == null) {
            return "상시";
        }
        if (start != null && end != null) {
            return start + " ~ " + end;
        }
        if (start != null) {
            return start + " ~";
        }
        return "~ " + end;
    }

    /**
     * AI 분석 결과 DTO
     * DocumentAiResult 엔티티 구조에 맞춰 수정
     */
    private PolicyAiDto mapToAiDto(DocumentAiResult r) {
        if (r == null) return null;

        List<String> keyPoints = parseJsonArray(r.getKeywordsJson());
        List<PolicyFaqDto> faqList = parseFaqJson(r.getQaTemplateJson());

        LocalDateTime analyzedAt = r.getCreatedAt(); // BaseTimeEntity 기준

        return new PolicyAiDto(
                r.getEasyExplanationText(), // easyText
                r.getSummaryText(),         // summary
                keyPoints,
                faqList,
                analyzedAt
        );
    }

    /**
     * 필수 서류 DTO
     * 현재 스키마에 없는 description/required는 임시 값 처리
     */
    private PolicyRequiredDocumentDto mapToRequiredDocumentDto(PolicyRequiredDocument d) {
        return new PolicyRequiredDocumentDto(
                d.getId(),
                d.getDocName(),                           // name
                null,                                     // description: 컬럼 없음 → null
                d.getSourceType() != null ? d.getSourceType().name() : null,
                Boolean.TRUE,                             // required: 정보 없음 → 일단 true
                d.getFileUri()                            // exampleUrl: 파일/양식 URL
        );
    }

    // --------------------------------------------------------------------
    // JSON 파싱
    // --------------------------------------------------------------------

    private List<String> parseJsonArray(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            // log.warn("Failed to parse keywords json: {}", json, e);
            return List.of(); // 실패 시 빈 리스트
        }
    }

    private List<PolicyFaqDto> parseFaqJson(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<PolicyFaqDto>>() {});
        } catch (Exception e) {
            // log.warn("Failed to parse FAQ json: {}", json, e);
            return List.of();
        }
    }
    // 🔽 공통 변환 로직 분리
    private PolicySummaryDto toPolicySummaryDto(PolicyData p) {
        return new PolicySummaryDto(
                p.getId(),
                p.getName(),
                p.getSummary(),
                p.getMainCategory() != null ? p.getMainCategory().getCode() : null,
                p.getMainCategory() != null ? p.getMainCategory().getName() : null, // 추가
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getDeptName(),    // 기관명
                p.getSupportCycle(),// 지원유형
                p.getOnapPossible()
        );
    }
}
