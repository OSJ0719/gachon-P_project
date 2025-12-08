package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.BookmarkDto;
import AI_Secretary.DTO.SearchDTO.PolicySummaryDto;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.sideService.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkQueryService {
    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public List<BookmarkDto> getBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(b -> new BookmarkDto(
                        b.getPolicy().getId(),
                        toPolicySummaryDto(b.getPolicy()),   // 👈 분리
                        b.getShortNote(),
                        b.getCreatedAt()
                ))
                .toList();
    }

    private PolicySummaryDto toPolicySummaryDto(PolicyData p) {
        return new PolicySummaryDto(
                p.getId(),
                p.getName(),
                p.getSummary(),
                p.getMainCategory() != null ? p.getMainCategory().getCode() : null,
                p.getMainCategory() != null ? p.getMainCategory().getName() : null,
                p.getRegionCtpv(),
                p.getRegionSgg(),
                p.getDeptName(),      // providerName
                p.getSupportCycle(),  // supportType (혹시 다른 필드 쓰면 여긴 바꿔주면 됨)
                p.getOnapPossible()
        );
    }
}