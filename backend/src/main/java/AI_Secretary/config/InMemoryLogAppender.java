package AI_Secretary.config;

import AI_Secretary.DTO.AdminDTO.DashboardLogLineDto;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.stream.Collectors;

public class InMemoryLogAppender extends AppenderBase<ILoggingEvent> {

    private final Deque<ILoggingEvent> buffer = new ArrayDeque<>();
    private final int maxSize = 200; // 최근 200줄만 유지

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    protected void append(ILoggingEvent eventObject) {
        synchronized (buffer) {
            if (buffer.size() >= maxSize) {
                buffer.removeFirst();
            }
            buffer.addLast(eventObject);
        }
    }

    public List<DashboardLogLineDto> getLogs(String levelFilter) {
        synchronized (buffer) {
            return buffer.stream()
                    .filter(ev -> levelFilter == null
                            || ev.getLevel().toString().equalsIgnoreCase(levelFilter))
                    .map(ev -> {
                        LocalDateTime time = LocalDateTime.ofInstant(
                                Instant.ofEpochMilli(ev.getTimeStamp()),
                                ZoneId.systemDefault()
                        );
                        return new DashboardLogLineDto(
                                time.format(FMT),
                                ev.getLevel().toString(),
                                ev.getFormattedMessage()
                        );
                    })
                    .collect(Collectors.toList());
        }
    }
}
