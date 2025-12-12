package AI_Secretary.DTO.AdminDTO;

public record CreateNotificationRequestDto(
        Long id,
        String type,
        String title
){
}
