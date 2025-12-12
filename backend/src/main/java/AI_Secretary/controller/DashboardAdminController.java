package AI_Secretary.controller;

import AI_Secretary.DTO.AdminDTO.DashboardSummaryResponse;
import AI_Secretary.service.Admin.DashboardAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardAdminController {

    private final DashboardAdminService dashboardAdminService;

    @GetMapping
    public ResponseEntity<DashboardSummaryResponse> getDashboard() {
        return ResponseEntity.ok(dashboardAdminService.getSummary());
    }
}