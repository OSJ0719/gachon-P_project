package AI_Secretary.repository.search;

import AI_Secretary.domain.categories;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<categories,String> {
    List<categories> findByCodeIn(List<String> codes);
}
