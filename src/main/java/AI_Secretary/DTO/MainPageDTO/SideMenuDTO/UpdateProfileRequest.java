package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.util.List;

public record UpdateProfileRequest(
        Integer age,
        String regionCode,
        String regionName,
        String householdType,     // "ALONE", "FAMILY" 등 간단 태그
        List<String> categoryCodes
) {
}
