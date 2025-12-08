package AI_Secretary.repository.User;

import AI_Secretary.domain.user.UserInterests;
import AI_Secretary.domain.user.UserInterestsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserInterestsRepository extends JpaRepository<UserInterests, UserInterestsId> {

    // user 필드의 id를 기준으로 조회
    List<UserInterests> findByUser_Id(Long userId);


    void deleteByUserId(Long userId);
}