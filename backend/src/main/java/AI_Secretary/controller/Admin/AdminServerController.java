package AI_Secretary.controller.Admin;


import AI_Secretary.DTO.AdminDTO.ServerLogResponse;
import AI_Secretary.DTO.AdminDTO.ServerMetricsResponse;
import AI_Secretary.service.Admin.AdminServerMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/server")
@RequiredArgsConstructor
public class AdminServerController {

    private final AdminServerMonitoringService service;

    @GetMapping("/metrics")
    public ResponseEntity<ServerMetricsResponse> getMetrics() {
        return ResponseEntity.ok(service.getMetrics());
    }

    @GetMapping("/logs")
    public ResponseEntity<ServerLogResponse> getLogs(
            @RequestParam(required = false) String level
    ) {
        return ResponseEntity.ok(service.getLogs(level));
    }
}