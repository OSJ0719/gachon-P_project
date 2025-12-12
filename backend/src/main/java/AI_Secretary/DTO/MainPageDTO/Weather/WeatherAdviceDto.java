package AI_Secretary.DTO.MainPageDTO.Weather;

public record WeatherAdviceDto(
        String title,       // "오늘은 우산 챙기시는 게 좋아요"
        String detailText,  // 한두 문단 설명
        String level
) {
}
