package AI_Secretary.controller.Home;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.BookmarkCreateRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.BookmarkDto;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.Menu.BookmarkCommandService;
import AI_Secretary.service.Menu.BookmarkQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkQueryService bookmarkQueryService;
    private final BookmarkCommandService bookmarkCommandService;

    @GetMapping
    public ResponseEntity<?> getBookmarks(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        var bookmarks = bookmarkQueryService.getBookmarks(userDetails.getUserId());
        return ResponseEntity.ok(bookmarks);
    }
    // 2) 북마크 추가
    @PostMapping
    public BookmarkDto addBookmark(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BookmarkCreateRequest request
    ) {
        Long userId = userDetails.getUserId();
        return bookmarkCommandService.addBookmark(userId, request);
    }

    // 3) 북마크 삭제 (정책 기준)
    @DeleteMapping("/{policyId}")
    public void deleteBookmark(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long policyId
    ) {
        Long userId = userDetails.getUserId();
        bookmarkCommandService.removeBookmark(userId, policyId);
    }
}
