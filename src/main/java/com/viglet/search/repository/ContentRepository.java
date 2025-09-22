package com.viglet.search.repository;

import com.viglet.search.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    
    List<Content> findByCategory(String category);
    
    List<Content> findByAuthor(String author);
    
    List<Content> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT c FROM Content c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:author IS NULL OR c.author = :author) AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.body) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Content> findByFilters(@Param("category") String category, 
                               @Param("author") String author, 
                               @Param("query") String query);
}