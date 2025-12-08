package AI_Secretary.repository.sideService;

import AI_Secretary.domain.subMenus.CalendarEvent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent,Long> {

    List<CalendarEvent> findByUserIdAndDateOrderByStartTimeAsc(Long userId, LocalDate date);
    @Query("""
        select e.date from CalendarEvent e
        where e.user.id = :userId
          and e.policy.id = :policyId
          and e.date >= CURRENT_DATE
        order by e.date asc
    """)
    Optional<LocalDate> findNearestDateByUserIdAndPolicyId(@Param("userId") Long userId,
                                                           @Param("policyId") Long policyId);
    // 특정 날짜의 일정 (한 칸에 한 개라고 가정)
    Optional<CalendarEvent> findByUserIdAndDate(Long userId, LocalDate date);

    // 특정 날짜 범위 조회 (월 캘린더 화면 등에서 쓸 수 있음)
    List<CalendarEvent> findByUserIdAndDateBetweenOrderByDateAsc(
            Long userId,
            LocalDate start,
            LocalDate end
    );

    // 특정 날짜 일정 삭제
    void deleteByUserIdAndDate(Long userId, LocalDate date);
}
