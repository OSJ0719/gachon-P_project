package AI_Secretary.service;


import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.ChecklistItemResponse;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.PolicyChecklistResponse;
import AI_Secretary.repository.User.UserChecklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserChecklistQueryService {

    private final UserChecklistRepository userChecklistRepository;

    public PolicyChecklistResponse getChecklistForPolicy(Long userId, Long policyId) {
        var items = userChecklistRepository
                .findByUserIdAndPolicyIdOrderBySortOrderAsc(userId, policyId)
                .stream()
                .map(ChecklistItemResponse::from)
                .toList();

        return PolicyChecklistResponse.of(policyId, items);
    }

    public boolean hasChecklist(Long userId, Long policyId) {
        return userChecklistRepository.countByUserIdAndPolicyId(userId, policyId) > 0;
    }
}