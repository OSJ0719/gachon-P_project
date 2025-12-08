package AI_Secretary.DTO.SearchDTO;

import java.time.LocalDateTime;

public record PolicyBasicDto(
        Long id,
        String title,
        String categoryName,
        String provider,          // 주관부처/기관명
        String regionCtpv,        // 시/도
        String regionSigg,        // 시/군/구 (있다면)
        String supportType,       // 현금/현물/서비스 등
        String applicationPeriod, // 상시 / ~까지
        String targetDescription, // 지원대상 설명
        String summaryText,       // 원문 요약 or 정책 개요
        LocalDateTime lastSyncedAt
) {
}
