package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

public record ChecklistItemRequest(
        String itemName,
        Boolean checked,        // null 이면 기존값 혹은 false 처리
        Integer sortOrder,      // null 이면 마지막 순서로
        Long requiredDocumentId
) {
}
