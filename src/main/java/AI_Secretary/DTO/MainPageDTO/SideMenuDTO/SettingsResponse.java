package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

public record SettingsResponse(
        boolean notifyPolicyChanges,
        boolean notifyCalendarAlerts,
        boolean notifyMarketing
) {
}
