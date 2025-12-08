package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.BookmarkCreateRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.BookmarkDto;
import AI_Secretary.DTO.SearchDTO.PolicySummaryDto;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.subMenus.Bookmark;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import AI_Secretary.repository.sideService.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkCommandService {
    private final BookmarkRepository bookmarkRepository;
    private final PolicyDataRepository policyDataRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookmarkDto addBookmark(Long userId, BookmarkCreateRequest req) {

        // 1) 유저, 정책 조회
        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        PolicyData policy = policyDataRepository.findById(req.policyId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 정책입니다."));

        // 2) 이미 북마크 되어 있으면 그냥 기존 걸 그대로 DTO로 반환 (또는 예외 던져도 됨)
        if (bookmarkRepository.existsByUserIdAndPolicyId(userId, req.policyId())) {
            Bookmark existing = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .filter(b -> b.getPolicy().getId().equals(req.policyId()))
                    .findFirst()
                    .orElseThrow(); // 이 상황은 거의 안 나올 것

            return toDto(existing);
        }

        // 3) 신규 북마크 생성
        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .policy(policy)
                .shortNote(req.shortNote())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);

        return toDto(saved);
    }
    @Transactional
    public void removeBookmark(Long userId, Long policyId) {
        // 사용자 검증 정도만 하고, 단순 삭제
        if (!bookmarkRepository.existsByUserIdAndPolicyId(userId, policyId)) {
            return; // 없으면 조용히 무시하거나, IllegalArgumentException 던져도 됨
        }

        bookmarkRepository.deleteByUserIdAndPolicyId(userId, policyId);
    }
    // 🔽 Bookmark → BookmarkDto 변환 (BookmarkQueryService와 로직 맞춰주기)
    private BookmarkDto toDto(Bookmark b) {
        PolicyData p = b.getPolicy();
        PolicySummaryDto policySummary = new PolicySummaryDto(
                p.getId(),
                p.getName(),
                p.getSummary(),
                p.getMainCategory() != null ? p.getMainCategory().getCode() : null,
                p.getMainCategory() != null ? p.getMainCategory().getName() : null,
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getDeptName(),
                p.getSupportCycle(),
                p.getOnapPossible()
        );

        return new BookmarkDto(
                b.getId(),
                policySummary,
                b.getShortNote(),
                b.getCreatedAt()
        );
    }
}
