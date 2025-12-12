package AI_Secretary.DTO.AdminDTO;

public record ServerMetricsResponse(
        ApiStatus api,
        AiStatus ai,
        DbStatus db
) {
    public record ApiStatus(String status, String uptime) {}
    public record AiStatus(String status, Integer latencyMs) {}
    public record DbStatus(String status, Integer active, Integer max) {}
}
