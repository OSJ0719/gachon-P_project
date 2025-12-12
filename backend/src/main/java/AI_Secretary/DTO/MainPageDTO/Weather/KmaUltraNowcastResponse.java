package AI_Secretary.DTO.MainPageDTO.Weather;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KmaUltraNowcastResponse {

    private Response response;

    @Getter
    @Setter
    public static class Response {
        private Header header;
        private Body body;
    }

    @Getter
    @Setter
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Getter
    @Setter
    public static class Body {
        private String dataType;
        private Items items;
        private Integer pageNo;
        private Integer numOfRows;
        private Integer totalCount;
    }

    @Getter
    @Setter
    public static class Items {
        private List<Item> item;
    }

    @Getter
    @Setter
    public static class Item {
        private String baseDate;   // YYYYMMDD
        private String baseTime;   // HHmm
        private String category;   // T1H, RN1, REH, PTY, VEC, WSD ...
        private String nx;
        private String ny;
        private String obsrValue;  // 관측값
    }
}