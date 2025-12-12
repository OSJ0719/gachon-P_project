package AI_Secretary.DTO.AdminDTO;


import java.time.LocalDateTime;

public record DashboardLogLineDto(
        //LocalDateTime time,
        String time,
        String level,      // INFO, WARN, ERROR ...
        String message
) {}