package com.viglet.search.config;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.SearcherManager;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class LuceneConfig {
    
    @Value("${viglet.search.index.path:./lucene-index}")
    private String indexPath;
    
    private Directory directory;
    private IndexWriter indexWriter;
    private SearcherManager searcherManager;
    
    @Bean
    public Analyzer analyzer() {
        return new StandardAnalyzer();
    }
    
    @Bean
    public Directory directory() throws IOException {
        if (directory == null) {
            Path path = Paths.get(indexPath);
            directory = FSDirectory.open(path);
        }
        return directory;
    }
    
    @Bean
    public IndexWriter indexWriter(Directory directory, Analyzer analyzer) throws IOException {
        if (indexWriter == null) {
            IndexWriterConfig config = new IndexWriterConfig(analyzer);
            config.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
            indexWriter = new IndexWriter(directory, config);
        }
        return indexWriter;
    }
    
    @Bean
    public SearcherManager searcherManager(Directory directory, IndexWriter indexWriter) throws IOException {
        if (searcherManager == null) {
            // Ensure the index exists by committing the IndexWriter first
            indexWriter.commit();
            searcherManager = new SearcherManager(directory, null);
        }
        return searcherManager;
    }
    
    @PreDestroy
    public void cleanup() {
        try {
            if (indexWriter != null) {
                indexWriter.close();
            }
            if (searcherManager != null) {
                searcherManager.close();
            }
            if (directory != null) {
                directory.close();
            }
        } catch (IOException e) {
            // Log error but don't throw exception during shutdown
            System.err.println("Error during Lucene cleanup: " + e.getMessage());
        }
    }
}