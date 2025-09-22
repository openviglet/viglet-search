package com.viglet.search.dto;

import java.time.LocalDateTime;

public class SearchResultDto {
    
    private Long id;
    private String title;
    private String body;
    private String category;
    private String author;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private float score;
    private String highlightedTitle;
    private String highlightedBody;
    
    // Constructors
    public SearchResultDto() {
    }
    
    public SearchResultDto(Long id, String title, String body, String category, 
                          String author, String tags, LocalDateTime createdAt, 
                          LocalDateTime updatedAt, float score) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.category = category;
        this.author = author;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.score = score;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public float getScore() {
        return score;
    }
    
    public void setScore(float score) {
        this.score = score;
    }
    
    public String getHighlightedTitle() {
        return highlightedTitle;
    }
    
    public void setHighlightedTitle(String highlightedTitle) {
        this.highlightedTitle = highlightedTitle;
    }
    
    public String getHighlightedBody() {
        return highlightedBody;
    }
    
    public void setHighlightedBody(String highlightedBody) {
        this.highlightedBody = highlightedBody;
    }
}