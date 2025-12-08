package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import AI_Secretary.DTO.SearchDTO.PolicySummaryDto;

import java.time.LocalDateTime;

public record BookmarkDto(
        Long id,
        PolicySummaryDto policy,
        String shortNote,
        LocalDateTime createdAt
) {
}
