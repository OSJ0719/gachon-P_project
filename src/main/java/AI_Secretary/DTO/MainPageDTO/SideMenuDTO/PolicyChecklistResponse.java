package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.util.List;

public record PolicyChecklistResponse(
        Long policyId,
        List<ChecklistItemResponse> items
) {
    public static PolicyChecklistResponse of(Long policyId, List<ChecklistItemResponse> items) {
        return new PolicyChecklistResponse(policyId, items);
    }
}
