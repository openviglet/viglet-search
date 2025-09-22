package com.viglet.search.controller;

import com.viglet.search.dto.ContentDto;
import com.viglet.search.dto.SearchResultDto;
import com.viglet.search.entity.Content;
import com.viglet.search.service.ContentService;
import jakarta.validation.Valid;
import org.apache.lucene.queryparser.classic.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/content")
public class ContentRestController {
    
    private final ContentService contentService;
    
    @Autowired
    public ContentRestController(ContentService contentService) {
        this.contentService = contentService;
    }
    
    @GetMapping
    public ResponseEntity<List<Content>> getAllContent() {
        List<Content> contents = contentService.findAll();
        return ResponseEntity.ok(contents);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        Optional<Content> content = contentService.findById(id);
        return content.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createContent(@Valid @RequestBody ContentDto contentDto) {
        try {
            Content createdContent = contentService.save(contentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error indexing content: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating content: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContent(@PathVariable Long id, @Valid @RequestBody ContentDto contentDto) {
        try {
            Content updatedContent = contentService.update(id, contentDto);
            return ResponseEntity.ok(updatedContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating index: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating content: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContent(@PathVariable Long id) {
        try {
            contentService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating index: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting content: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchContent(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            @RequestParam(defaultValue = "50") int maxResults) {
        
        try {
            List<SearchResultDto> results = contentService.search(query, category, author, maxResults);
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Search error: " + e.getMessage());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid query syntax: " + e.getMessage());
        }
    }
    
    @PostMapping("/reindex")
    public ResponseEntity<?> reindexAll() {
        try {
            contentService.reindexAll();
            return ResponseEntity.ok("Reindexing completed successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reindexing: " + e.getMessage());
        }
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<Content>> filterContent(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String query) {
        
        List<Content> results = contentService.findByFilters(category, author, query);
        return ResponseEntity.ok(results);
    }
}