package AI_Secretary.DTO.SearchDTO;

import java.time.LocalDate;

public record PolicyUserContextDto(
        boolean bookmarked,
        boolean hasChecklist,
        LocalDate nearestEventDate
) {
}
