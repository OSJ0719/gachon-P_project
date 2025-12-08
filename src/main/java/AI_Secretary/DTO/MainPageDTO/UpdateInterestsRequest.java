package AI_Secretary.DTO.MainPageDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateInterestsRequest(
        List<@NotBlank @Size(max = 50) String> categoryCodes
) {}