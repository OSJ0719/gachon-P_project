package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.util.List;

public record UserProfileResponse(
        Integer age,
        String regionCtpv,
        String regionSgg,
        String regionDong,
        List<String> categoryCodes,
        boolean onboardingCompleted
) {}
