package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

public record CalendarEventRequest(
        String date,        // "2025-12-05" (필수)
        String title,       // 칸에 표시할 제목 (빈 문자열이면 FE에서 delete 호출)
        String memo,        // 상세 메모 (선택, 없으면 null/빈 문자열)
        String startTime,   // "09:00" (선택)
        String endTime,     // "10:00" (선택)
        Long policyId,      // 정책 상세에서 넘어오는 경우 (선택)
        Long documentId
) {
}
