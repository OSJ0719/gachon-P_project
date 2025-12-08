package AI_Secretary.repository.User;

import AI_Secretary.domain.user.users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<users,Long> {

    Optional<users> findByUsername(String username);

    boolean existsByUsername(String username);
}
