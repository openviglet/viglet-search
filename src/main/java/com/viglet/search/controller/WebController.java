package com.viglet.search.controller;

import com.viglet.search.dto.ContentDto;
import com.viglet.search.dto.SearchResultDto;
import com.viglet.search.entity.Content;
import com.viglet.search.service.ContentService;
import jakarta.validation.Valid;
import org.apache.lucene.queryparser.classic.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Controller
public class WebController {
    
    private final ContentService contentService;
    
    @Autowired
    public WebController(ContentService contentService) {
        this.contentService = contentService;
    }
    
    @GetMapping("/")
    public String home(Model model) {
        List<Content> recentContent = contentService.findAll();
        model.addAttribute("recentContent", recentContent.size() > 10 ? recentContent.subList(0, 10) : recentContent);
        return "index";
    }
    
    @GetMapping("/search")
    public String searchPage(@RequestParam(required = false) String query,
                           @RequestParam(required = false) String category,
                           @RequestParam(required = false) String author,
                           Model model) {
        
        model.addAttribute("query", query);
        model.addAttribute("category", category);
        model.addAttribute("author", author);
        
        if (query != null || category != null || author != null) {
            try {
                List<SearchResultDto> results = contentService.search(query, category, author, 50);
                model.addAttribute("results", results);
                model.addAttribute("resultCount", results.size());
            } catch (IOException | ParseException e) {
                model.addAttribute("error", "Search error: " + e.getMessage());
            }
        }
        
        return "search";
    }
    
    @GetMapping("/content")
    public String listContent(Model model) {
        List<Content> contents = contentService.findAll();
        model.addAttribute("contents", contents);
        return "content/list";
    }
    
    @GetMapping("/content/new")
    public String newContentForm(Model model) {
        model.addAttribute("contentDto", new ContentDto());
        return "content/form";
    }
    
    @PostMapping("/content")
    public String createContent(@Valid @ModelAttribute ContentDto contentDto,
                              BindingResult result,
                              RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            return "content/form";
        }
        
        try {
            contentService.save(contentDto);
            redirectAttributes.addFlashAttribute("successMessage", "Content created successfully!");
            return "redirect:/content";
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error indexing content: " + e.getMessage());
            return "content/form";
        }
    }
    
    @GetMapping("/content/{id}")
    public String viewContent(@PathVariable Long id, Model model) {
        Optional<Content> content = contentService.findById(id);
        if (content.isEmpty()) {
            return "redirect:/content";
        }
        
        model.addAttribute("content", content.get());
        return "content/view";
    }
    
    @GetMapping("/content/{id}/edit")
    public String editContentForm(@PathVariable Long id, Model model) {
        Optional<Content> content = contentService.findById(id);
        if (content.isEmpty()) {
            return "redirect:/content";
        }
        
        ContentDto contentDto = contentService.convertToDto(content.get());
        model.addAttribute("contentDto", contentDto);
        model.addAttribute("contentId", id);
        return "content/form";
    }
    
    @PostMapping("/content/{id}")
    public String updateContent(@PathVariable Long id,
                              @Valid @ModelAttribute ContentDto contentDto,
                              BindingResult result,
                              RedirectAttributes redirectAttributes,
                              Model model) {
        
        if (result.hasErrors()) {
            model.addAttribute("contentId", id);
            return "content/form";
        }
        
        try {
            contentService.update(id, contentDto);
            redirectAttributes.addFlashAttribute("successMessage", "Content updated successfully!");
            return "redirect:/content";
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating index: " + e.getMessage());
            model.addAttribute("contentId", id);
            return "content/form";
        } catch (RuntimeException e) {
            return "redirect:/content";
        }
    }
    
    @PostMapping("/content/{id}/delete")
    public String deleteContent(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            contentService.delete(id);
            redirectAttributes.addFlashAttribute("successMessage", "Content deleted successfully!");
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating index: " + e.getMessage());
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Content not found");
        }
        
        return "redirect:/content";
    }
    
    @PostMapping("/reindex")
    public String reindexAll(RedirectAttributes redirectAttributes) {
        try {
            contentService.reindexAll();
            redirectAttributes.addFlashAttribute("successMessage", "Reindexing completed successfully!");
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error reindexing: " + e.getMessage());
        }
        
        return "redirect:/content";
    }
}