package AI_Secretary.DTO.AdminDTO;

import AI_Secretary.domain.policyData.PolicyData;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Value
@Builder
public class PolicySnapShot {
    String name;
    String summary;
    String lifeCycle;
    String supportCycle;
    String regionCtpv;
    String regionSgg;
    String deptName;
    LocalDate startDate;
    LocalDate endDate;
    LocalDateTime lastModifiedAt;

    public static PolicySnapShot from(PolicyData p) {
        if (p == null) return null;
        return PolicySnapShot.builder()
                .name(p.getName())
                .summary(p.getSummary())
                .lifeCycle(p.getLifeCycle())
                .supportCycle(p.getSupportCycle())
                .regionCtpv(p.getRegionCtpv())
                .regionSgg(p.getRegionSgg())
                .deptName(p.getDeptName())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .lastModifiedAt(p.getLastModifiedAt())
                .build();
    }
}
