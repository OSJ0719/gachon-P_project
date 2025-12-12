package AI_Secretary.DTO.AdminDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminPolicyUpdateRequest(
        Long id,
        String name,
        String categoryCode,
        String categoryName,
        String regionCtpv,
        String regionSgg,
        String provider,
        String supportType,
        String lifeCycle,
        String summary,
        Boolean onapPossible,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime lastModifiedAt
) {
}
