package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.util.List;

public record UpdateUserProfileRequest(
        Integer age,
        String regionCtpv,
        String regionSgg,
        String regionDong,
        String incomeLevel,
        Boolean hasDisability,
        Boolean livingAlone,
        java.util.List<String> interestCodes   // ⭐ 반드시 있어야 함
) {}