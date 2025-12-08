package AI_Secretary.Security;
import AI_Secretary.domain.user.users;
import java.util.Collection;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final users user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // DB에는 'USER', 'ADMIN' 저장, Security에는 ROLE_ prefix 붙여 사용
        String role = "ROLE_" + user.getRole();
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    public Long getUserId() {
        return user.getId();
    }

    public users getUser() {
        return user;
    }

    // 아래들은 간단히 true 리턴 (MVP 기준)
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
