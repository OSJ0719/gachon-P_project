package AI_Secretary.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_profile")
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private Long id;


    @Column(length = 20)
    private String phone;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private users user;

    private Integer age;

    @Column(name = "region_code", length = 20)
    private String regionCode;

    @Column(name = "region_name", length = 100)
    private String regionName;

    // ------------------------------
    // 🔥 새로 추가된 지역 정보 컬럼들
    // ------------------------------
    @Column(name = "region_ctpv", length = 50)
    private String regionCtpv;

    @Column(name = "region_sgg", length = 50)
    private String regionSgg;

    @Column(name = "region_dong", length = 50)
    private String regionDong;

    @Column(name = "income_level", length = 50)
    private String incomeLevel;

    @Column(name = "has_disability")
    private Boolean hasDisability;

    @Column(name = "living_alone")
    private Boolean livingAlone;

    @Builder.Default
    @Column(name = "onboarding_completed", nullable = false)
    private Boolean onboardingCompleted = false;

    // 메서드
    public void markOnboardingCompleted() {
        this.onboardingCompleted = true;
    }

    public void updateRegion(String ctpv, String sgg, String dong) {
        this.regionCtpv = ctpv;
        this.regionSgg = sgg;
        this.regionDong = dong;
    }

    public void updateWelfareInfo(String incomeLevel, Boolean hasDisability, Boolean livingAlone) {
        this.incomeLevel = incomeLevel;
        this.hasDisability = hasDisability;
        this.livingAlone = livingAlone;
    }
    public void updateAge(Integer age) {
        this.age = age;
    }
}