package AI_Secretary.repository.search;


import AI_Secretary.domain.policyData.PolicyData;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PolicyDataRepository extends JpaRepository<PolicyData, Long> {

    // 검색바용: 이름/요약 기준 단순 검색
    @Query("""
        select p
        from PolicyData p
        where (:keyword is null or :keyword = '' 
               or p.name like concat('%', :keyword, '%')
               or p.summary like concat('%', :keyword, '%'))
        order by p.lastModifiedAt desc nulls last, p.createdAt desc
        """)
    List<PolicyData> searchByKeyword(@Param("keyword") String keyword);

    // 사용자 관심 카테고리 기반 추천 (아주 단순 버전)
    @Query("""
        select distinct p
        from PolicyData p
        left join p.mainCategory c
        where (:regionCtpv is null or p.regionCtpv = :regionCtpv)
          and (:categoryCodes is null or c.code in :categoryCodes)
        order by p.endDate asc nulls last
        """)
    List<PolicyData> findRecommendedForUser(
            @Param("regionCtpv") String regionCtpv,
            @Param("categoryCodes") List<String> categoryCodes
    );
    //상세 내용 검색 쿼리
    @Query("""
        select p
        from PolicyData p
        left join fetch p.mainCategory mc
        where p.id = :id
    """)
    Optional<PolicyData> findByIdWithCategory(@Param("id") Long id);
    @Query("""
        select p from PolicyData p
        where p.lastModifiedAt >= :since
    """)
    List<PolicyData> findChangedSince(@Param("since") LocalDateTime since);
}