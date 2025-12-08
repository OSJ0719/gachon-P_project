package AI_Secretary.DTO.MainPageDTO;

public record UpdateSettingsRequest(
        boolean notifyPolicyChanges,
        boolean notifyCalendarAlerts,
        boolean notifyMarketing
) {
}
