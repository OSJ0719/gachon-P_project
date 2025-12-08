package AI_Secretary.DTO.SearchDTO;

public record PolicySummaryDto(
        Long id,
        String name,
        String summary,
        String mainCategoryCode,
        String mainCategoryName,   // 추가
        String regionCtpv,
        String regionSgg,
        String providerName,       // dept_name
        String supportType,        // 유형
        String onapPossible
) {}