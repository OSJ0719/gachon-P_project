package AI_Secretary.service.Admin;

import AI_Secretary.DTO.AdminDTO.AdminPolicyDetailDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicySummaryDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyUpdateRequest;
import AI_Secretary.Exceptions.PolicyNotFoundException;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.search.PolicyDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPolicyManagementService {

    private final PolicyDataRepository policyDataRepository;

    // =========================================================
    // 1) 목록 조회 (키워드 검색 포함)
    // =========================================================
    @Transactional(readOnly = true)
    public List<AdminPolicySummaryDto> getPolicyList(String keyword) {
        List<PolicyData> list;

        if (keyword == null || keyword.isBlank()) {
            list = policyDataRepository.findAll();
        } else {
            list = policyDataRepository.searchByKeyword(keyword);
        }

        return list.stream()
                .map(this::toSummaryDto)
                .toList();
    }

    // =========================================================
    // 2) 단건 상세 조회
    // =========================================================
    @Transactional(readOnly = true)
    public AdminPolicyDetailDto getPolicyDetail(Long policyId) {
        PolicyData p = policyDataRepository.findByIdWithCategory(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        return toDetailDto(p);
    }

    // =========================================================
    // 3) 정책 수정
    // =========================================================
    @Transactional
    public AdminPolicyDetailDto updatePolicy(Long policyId, AdminPolicyUpdateRequest req) {
        PolicyData p = policyDataRepository.findByIdWithCategory(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // 이름(제목)
        if (req.name() != null) {
            p.setName(req.name());
        }

        // 카테고리 코드는 정책에 따라 변경 허용 여부 결정
        // if (req.categoryCode() != null) { ... }

        // 지역
        if (req.regionCtpv() != null) {
            p.setRegionCtpv(req.regionCtpv());
        }
        if (req.regionSgg() != null) {
            p.setRegionSgg(req.regionSgg());
        }

        // 기관명 / 지원유형 / 대상 / 요약
        if (req.provider() != null) {
            p.setDeptName(req.provider());
        }
        if (req.supportType() != null) {
            p.setSupportCycle(req.supportType());
        }
        if (req.lifeCycle() != null) {
            p.setLifeCycle(req.lifeCycle());
        }
        if (req.summary() != null) {
            p.setSummary(req.summary());
        }

        // ONAP 가능 여부 (Boolean → "Y"/"N")
        if (req.onapPossible() != null) {
            p.setOnapPossible(booleanToYN(req.onapPossible()));
        }

        // 신청 기간
        LocalDate start = req.startDate();
        LocalDate end   = req.endDate();
        if (start != null) {
            p.setStartDate(start);
        }
        if (end != null) {
            p.setEndDate(end);
        }

        // 마지막 수정 시각 갱신
        p.setLastModifiedAt(LocalDateTime.now());

        return toDetailDto(p);
    }

    // =========================================================
    // 4) DTO 매핑
    // =========================================================
    private AdminPolicySummaryDto toSummaryDto(PolicyData p) {
        return new AdminPolicySummaryDto(
                p.getId(),
                p.getName(),
                p.getMainCategory() != null ? p.getMainCategory().getCode() : null,
                p.getMainCategory() != null ? p.getMainCategory().getName() : null,
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getDeptName(),              // provider
                p.getSupportCycle(),          // supportType
                p.getLifeCycle(),             // lifeCycle
                p.getSummary(),               // summary
                ynToBoolean(p.getOnapPossible()),
                p.getStartDate(),
                p.getEndDate(),
                p.getLastModifiedAt()
        );
    }

    private AdminPolicyDetailDto toDetailDto(PolicyData p) {
        return new AdminPolicyDetailDto(
                p.getId(),
                p.getName(),
                p.getMainCategory() != null ? p.getMainCategory().getCode() : null,
                p.getMainCategory() != null ? p.getMainCategory().getName() : null,
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getDeptName(),
                p.getSupportCycle(),      // supportType
                p.getLifeCycle(),         // lifeCycle
                p.getSummary(),           // summary
                ynToBoolean(p.getOnapPossible()),
                p.getStartDate(),
                p.getEndDate(),
                p.getLastModifiedAt()
        );
    }

    // =========================================================
    // 5) Y/N <-> Boolean 매핑 헬퍼
    // =========================================================
    private Boolean ynToBoolean(String yn) {
        if (yn == null) return null;
        return "Y".equalsIgnoreCase(yn);
    }

    private String booleanToYN(Boolean value) {
        if (value == null) return null;
        return value ? "Y" : "N";
    }
}