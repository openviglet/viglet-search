package com.viglet.search.service;

import com.viglet.search.dto.SearchResultDto;
import com.viglet.search.entity.Content;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.LongPoint;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.MultiFieldQueryParser;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.SearcherManager;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.highlight.Fragmenter;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.lucene.search.highlight.QueryScorer;
import org.apache.lucene.search.highlight.SimpleHTMLFormatter;
import org.apache.lucene.search.highlight.SimpleSpanFragmenter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class LuceneService {
    
    private static final String FIELD_ID = "id";
    private static final String FIELD_TITLE = "title";
    private static final String FIELD_BODY = "body";
    private static final String FIELD_CATEGORY = "category";
    private static final String FIELD_AUTHOR = "author";
    private static final String FIELD_TAGS = "tags";
    private static final String FIELD_CREATED_AT = "createdAt";
    private static final String FIELD_UPDATED_AT = "updatedAt";
    
    private final IndexWriter indexWriter;
    private final SearcherManager searcherManager;
    private final Analyzer analyzer;
    
    @Autowired
    public LuceneService(IndexWriter indexWriter, SearcherManager searcherManager, Analyzer analyzer) {
        this.indexWriter = indexWriter;
        this.searcherManager = searcherManager;
        this.analyzer = analyzer;
    }
    
    public void indexContent(Content content) throws IOException {
        Document document = createDocument(content);
        
        // Update or add document (remove existing with same ID first)
        if (content.getId() != null) {
            indexWriter.updateDocument(new Term(FIELD_ID, content.getId().toString()), document);
        } else {
            indexWriter.addDocument(document);
        }
        indexWriter.commit();
        searcherManager.maybeRefresh();
    }
    
    public void deleteContent(Long contentId) throws IOException {
        indexWriter.deleteDocuments(new Term(FIELD_ID, contentId.toString()));
        indexWriter.commit();
        searcherManager.maybeRefresh();
    }
    
    public List<SearchResultDto> search(String query, String category, String author, int maxResults) 
            throws IOException, ParseException {
        
        searcherManager.maybeRefresh();
        IndexSearcher searcher = searcherManager.acquire();
        
        try {
            BooleanQuery.Builder booleanQueryBuilder = new BooleanQuery.Builder();
            
            // Add text search query if provided
            if (query != null && !query.trim().isEmpty()) {
                String[] fields = {FIELD_TITLE, FIELD_BODY, FIELD_TAGS};
                MultiFieldQueryParser parser = new MultiFieldQueryParser(fields, analyzer);
                Query textQuery = parser.parse(QueryParser.escape(query));
                booleanQueryBuilder.add(textQuery, BooleanClause.Occur.MUST);
            }
            
            // Add category filter if provided
            if (category != null && !category.trim().isEmpty()) {
                Query categoryQuery = new TermQuery(new Term(FIELD_CATEGORY, category));
                booleanQueryBuilder.add(categoryQuery, BooleanClause.Occur.MUST);
            }
            
            // Add author filter if provided
            if (author != null && !author.trim().isEmpty()) {
                Query authorQuery = new TermQuery(new Term(FIELD_AUTHOR, author));
                booleanQueryBuilder.add(authorQuery, BooleanClause.Occur.MUST);
            }
            
            BooleanQuery finalQuery = booleanQueryBuilder.build();
            
            // If no conditions were added, return empty results
            if (finalQuery.clauses().isEmpty()) {
                return new ArrayList<>();
            }
            
            TopDocs topDocs = searcher.search(finalQuery, maxResults);
            
            // Create highlighter
            Highlighter highlighter = createHighlighter(finalQuery);
            
            List<SearchResultDto> results = new ArrayList<>();
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                Document doc = searcher.doc(scoreDoc.doc);
                SearchResultDto result = createSearchResult(doc, scoreDoc.score, highlighter);
                results.add(result);
            }
            
            return results;
        } finally {
            searcherManager.release(searcher);
        }
    }
    
    private Document createDocument(Content content) {
        Document document = new Document();
        
        if (content.getId() != null) {
            document.add(new StoredField(FIELD_ID, content.getId()));
            document.add(new LongPoint(FIELD_ID, content.getId()));
        }
        
        document.add(new TextField(FIELD_TITLE, content.getTitle() != null ? content.getTitle() : "", Field.Store.YES));
        document.add(new TextField(FIELD_BODY, content.getBody() != null ? content.getBody() : "", Field.Store.YES));
        document.add(new TextField(FIELD_CATEGORY, content.getCategory() != null ? content.getCategory() : "", Field.Store.YES));
        document.add(new TextField(FIELD_AUTHOR, content.getAuthor() != null ? content.getAuthor() : "", Field.Store.YES));
        document.add(new TextField(FIELD_TAGS, content.getTags() != null ? content.getTags() : "", Field.Store.YES));
        
        if (content.getCreatedAt() != null) {
            document.add(new StoredField(FIELD_CREATED_AT, content.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
        }
        if (content.getUpdatedAt() != null) {
            document.add(new StoredField(FIELD_UPDATED_AT, content.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
        }
        
        return document;
    }
    
    private SearchResultDto createSearchResult(Document doc, float score, Highlighter highlighter) {
        SearchResultDto result = new SearchResultDto();
        
        String idStr = doc.get(FIELD_ID);
        if (idStr != null) {
            result.setId(Long.parseLong(idStr));
        }
        
        result.setTitle(doc.get(FIELD_TITLE));
        result.setBody(doc.get(FIELD_BODY));
        result.setCategory(doc.get(FIELD_CATEGORY));
        result.setAuthor(doc.get(FIELD_AUTHOR));
        result.setTags(doc.get(FIELD_TAGS));
        result.setScore(score);
        
        String createdAtStr = doc.get(FIELD_CREATED_AT);
        if (createdAtStr != null) {
            result.setCreatedAt(LocalDateTime.parse(createdAtStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        
        String updatedAtStr = doc.get(FIELD_UPDATED_AT);
        if (updatedAtStr != null) {
            result.setUpdatedAt(LocalDateTime.parse(updatedAtStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        
        // Add highlighting
        try {
            String highlightedTitle = highlighter.getBestFragment(analyzer, FIELD_TITLE, result.getTitle());
            String highlightedBody = highlighter.getBestFragment(analyzer, FIELD_BODY, result.getBody());
            
            result.setHighlightedTitle(highlightedTitle != null ? highlightedTitle : result.getTitle());
            result.setHighlightedBody(highlightedBody != null ? highlightedBody : 
                    (result.getBody().length() > 200 ? result.getBody().substring(0, 200) + "..." : result.getBody()));
        } catch (IOException | InvalidTokenOffsetsException e) {
            // Use original text if highlighting fails
            result.setHighlightedTitle(result.getTitle());
            result.setHighlightedBody(result.getBody().length() > 200 ? result.getBody().substring(0, 200) + "..." : result.getBody());
        }
        
        return result;
    }
    
    private Highlighter createHighlighter(Query query) {
        SimpleHTMLFormatter formatter = new SimpleHTMLFormatter("<mark>", "</mark>");
        QueryScorer scorer = new QueryScorer(query);
        Highlighter highlighter = new Highlighter(formatter, scorer);
        Fragmenter fragmenter = new SimpleSpanFragmenter(scorer, 200);
        highlighter.setTextFragmenter(fragmenter);
        return highlighter;
    }
}