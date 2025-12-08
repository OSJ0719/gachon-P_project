package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import AI_Secretary.domain.subMenus.UserChecklist;

import java.time.LocalDateTime;

public record ChecklistItemResponse(
        Long id,
        String itemName,
        boolean checked,
        int sortOrder,
        Long requiredDocumentId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ChecklistItemResponse from(UserChecklist entity) {
        return new ChecklistItemResponse(
                entity.getId(),
                entity.getItemName(),
                entity.isChecked(),
                entity.getSortOrder(),
                entity.getRequiredDocument() != null ? entity.getRequiredDocument().getId() : null,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}