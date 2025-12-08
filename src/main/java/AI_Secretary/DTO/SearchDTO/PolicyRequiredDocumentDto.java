package AI_Secretary.DTO.SearchDTO;

public record PolicyRequiredDocumentDto(
        Long id,
        String name,          // 서류명
        String description,   // 간단 설명
        String sourceType,    // FORM / LAW / GUIDE / OTHER
        Boolean required,     // 필수 여부
        String exampleUrl
) {
}
