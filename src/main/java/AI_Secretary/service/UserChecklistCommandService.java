package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.ChecklistItemRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.ChecklistItemResponse;
import AI_Secretary.domain.subMenus.UserChecklist;
import AI_Secretary.repository.User.UserChecklistRepository;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import AI_Secretary.repository.search.PolicyRequiredDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserChecklistCommandService {

    private final UserChecklistRepository userChecklistRepository;
    private final UserRepository usersRepository;
    private final PolicyDataRepository policyDataRepository;
    private final PolicyRequiredDocumentRepository requiredDocumentsRepository;

    public ChecklistItemResponse createItem(Long userId, Long policyId, ChecklistItemRequest request) {
        var user = usersRepository.getReferenceById(userId);
        var policy = policyDataRepository.getReferenceById(policyId);

        int sortOrder = (request.sortOrder() != null)
                ? request.sortOrder()
                : getNextSortOrder(userId, policyId);

        var builder = UserChecklist.builder()
                .user(user)
                .policy(policy)
                .itemName(request.itemName())
                .checked(request.checked() != null && request.checked())
                .sortOrder(sortOrder);

        if (request.requiredDocumentId() != null) {
            var requiredDoc = requiredDocumentsRepository.getReferenceById(request.requiredDocumentId());
            builder.requiredDocument(requiredDoc);
        }

        var saved = userChecklistRepository.save(builder.build());
        return ChecklistItemResponse.from(saved);
    }

    public ChecklistItemResponse updateItem(Long userId, Long policyId, Long itemId, ChecklistItemRequest request) {
        var item = userChecklistRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 체크리스트 항목을 찾을 수 없습니다."));

        if (!item.getPolicy().getId().equals(policyId)) {
            throw new IllegalArgumentException("정책 정보가 일치하지 않습니다.");
        }

        int sortOrder = (request.sortOrder() != null)
                ? request.sortOrder()
                : item.getSortOrder();

        boolean checked = (request.checked() != null)
                ? request.checked()
                : item.isChecked();

        item.update(request.itemName(), checked, sortOrder);

        if (request.requiredDocumentId() != null) {
            var requiredDoc = requiredDocumentsRepository.getReferenceById(request.requiredDocumentId());
            item.changeRequiredDocument(requiredDoc);
        }

        return ChecklistItemResponse.from(item);
    }

    public ChecklistItemResponse toggleItem(Long userId, Long policyId, Long itemId) {
        var item = userChecklistRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 체크리스트 항목을 찾을 수 없습니다."));

        if (!item.getPolicy().getId().equals(policyId)) {
            throw new IllegalArgumentException("정책 정보가 일치하지 않습니다.");
        }

        item.toggleChecked();
        return ChecklistItemResponse.from(item);
    }

    public void deleteItem(Long userId, Long policyId, Long itemId) {
        var item = userChecklistRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 체크리스트 항목을 찾을 수 없습니다."));

        if (!item.getPolicy().getId().equals(policyId)) {
            throw new IllegalArgumentException("정책 정보가 일치하지 않습니다.");
        }

        userChecklistRepository.delete(item);
    }

    private int getNextSortOrder(Long userId, Long policyId) {
        var items = userChecklistRepository.findByUserIdAndPolicyIdOrderBySortOrderAsc(userId, policyId);
        return items.isEmpty() ? 0 : items.get(items.size() - 1).getSortOrder() + 1;
    }
}