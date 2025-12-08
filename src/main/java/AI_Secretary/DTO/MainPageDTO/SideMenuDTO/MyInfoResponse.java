package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.util.List;

// ✅ 추천: 이렇게 바꿔두면 FE랑 딱 맞음
public record MyInfoResponse(
        Long userId,
        String username,
        String name,
        String phone,
        Integer age,
        RegionDto region,
        Boolean onboardingCompleted,
        List<String> interestCategoryCodes
) {
    public record RegionDto(
            String city,     // = regionCtpv
            String district, // = regionSgg
            String dong      // = regionDong
    ) {}
}