package AI_Secretary.DTO.AdminDTO;

import java.util.List;

public record ServerLogResponse(
        List<DashboardLogLineDto> logs
) {
}
