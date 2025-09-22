package com.viglet.search.service;

import com.viglet.search.dto.ContentDto;
import com.viglet.search.dto.SearchResultDto;
import com.viglet.search.entity.Content;
import com.viglet.search.repository.ContentRepository;
import org.apache.lucene.queryparser.classic.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContentService {
    
    private final ContentRepository contentRepository;
    private final LuceneService luceneService;
    
    @Autowired
    public ContentService(ContentRepository contentRepository, LuceneService luceneService) {
        this.contentRepository = contentRepository;
        this.luceneService = luceneService;
    }
    
    public List<Content> findAll() {
        return contentRepository.findAll();
    }
    
    public Optional<Content> findById(Long id) {
        return contentRepository.findById(id);
    }
    
    public Content save(ContentDto contentDto) throws IOException {
        Content content = convertToEntity(contentDto);
        Content savedContent = contentRepository.save(content);
        
        // Index in Lucene
        luceneService.indexContent(savedContent);
        
        return savedContent;
    }
    
    public Content update(Long id, ContentDto contentDto) throws IOException {
        Optional<Content> existingContent = contentRepository.findById(id);
        if (existingContent.isEmpty()) {
            throw new RuntimeException("Content not found with id: " + id);
        }
        
        Content content = existingContent.get();
        updateContentFromDto(content, contentDto);
        Content updatedContent = contentRepository.save(content);
        
        // Update in Lucene
        luceneService.indexContent(updatedContent);
        
        return updatedContent;
    }
    
    public void delete(Long id) throws IOException {
        Optional<Content> content = contentRepository.findById(id);
        if (content.isEmpty()) {
            throw new RuntimeException("Content not found with id: " + id);
        }
        
        // Delete from database
        contentRepository.deleteById(id);
        
        // Delete from Lucene index
        luceneService.deleteContent(id);
    }
    
    public List<SearchResultDto> search(String query, String category, String author, int maxResults) 
            throws IOException, ParseException {
        return luceneService.search(query, category, author, maxResults);
    }
    
    public List<Content> findByFilters(String category, String author, String query) {
        return contentRepository.findByFilters(category, author, query);
    }
    
    public void reindexAll() throws IOException {
        List<Content> allContent = contentRepository.findAll();
        for (Content content : allContent) {
            luceneService.indexContent(content);
        }
    }
    
    private Content convertToEntity(ContentDto dto) {
        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setBody(dto.getBody());
        content.setCategory(dto.getCategory());
        content.setAuthor(dto.getAuthor());
        content.setTags(dto.getTags());
        return content;
    }
    
    private void updateContentFromDto(Content content, ContentDto dto) {
        content.setTitle(dto.getTitle());
        content.setBody(dto.getBody());
        content.setCategory(dto.getCategory());
        content.setAuthor(dto.getAuthor());
        content.setTags(dto.getTags());
    }
    
    public ContentDto convertToDto(Content content) {
        ContentDto dto = new ContentDto();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setBody(content.getBody());
        dto.setCategory(content.getCategory());
        dto.setAuthor(content.getAuthor());
        dto.setTags(content.getTags());
        return dto;
    }
}