# Viglet Search

A powerful content indexing and search platform built with Spring Boot and Apache Lucene.

## Features

- **Content Management**: Create, read, update, and delete content items
- **Full-Text Search**: Advanced search capabilities powered by Apache Lucene
- **REST API**: Complete REST API for programmatic access
- **Web Interface**: User-friendly web interface for content management and search
- **Search Highlighting**: Results include highlighted search terms
- **Filter Search**: Search by category, author, and text content
- **Real-time Indexing**: Content is automatically indexed when created or updated

## Technology Stack

- **Backend**: Spring Boot 3.2.0
- **Search Engine**: Apache Lucene 9.8.0
- **Database**: H2 Database (embedded)
- **ORM**: Spring Data JPA
- **Template Engine**: Thymeleaf
- **Frontend**: Bootstrap 5.3.0, Font Awesome 6.4.0
- **Build Tool**: Maven

## Quick Start

### Prerequisites

- Java 17 or later
- Maven 3.6 or later

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/openviglet/viglet-search.git
cd viglet-search
```

2. Build and run the application:
```bash
mvn spring-boot:run
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

The application will create an H2 database file and Lucene index directory automatically.

## API Endpoints

### Content Management

- `GET /api/content` - List all content
- `GET /api/content/{id}` - Get content by ID
- `POST /api/content` - Create new content
- `PUT /api/content/{id}` - Update content
- `DELETE /api/content/{id}` - Delete content

### Search

- `GET /api/content/search?query={text}&category={category}&author={author}&maxResults={number}` - Search content

### System

- `POST /api/content/reindex` - Reindex all content

## REST API Examples

### Create Content
```bash
curl -X POST http://localhost:8080/api/content \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Tutorial",
    "body": "This is a comprehensive tutorial about Spring Boot framework.",
    "category": "Technology",
    "author": "John Doe",
    "tags": "spring boot, java, tutorial"
  }'
```

### Search Content
```bash
curl "http://localhost:8080/api/content/search?query=java"
```

### Search with Filters
```bash
curl "http://localhost:8080/api/content/search?query=spring&category=Technology&author=John%20Doe"
```

## Web Interface

The web interface provides:

- **Home Page**: Overview and quick search
- **Advanced Search**: Full search capabilities with filters
- **Content Management**: CRUD operations for content
- **Search Results**: Highlighted search results with relevance scores

## Search Features

### Query Syntax

- `java spring` - Find documents containing both words
- `"spring boot"` - Find exact phrase
- `java OR python` - Find documents containing either word
- `java -python` - Find documents with java but not python

### Filters

- **Category**: Filter by content category
- **Author**: Filter by content author
- **Combined**: Use text query with filters for precise results

## Configuration

### Application Properties

Key configuration options in `application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:h2:./data/viglet-search

# Lucene Index Configuration
viglet.search.index.path=./lucene-index

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
```

### Custom Configuration

You can customize the Lucene index location by setting:
```properties
viglet.search.index.path=/path/to/your/index
```

## Project Structure

```
src/
├── main/
│   ├── java/com/viglet/search/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST and Web controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Business logic
│   └── resources/
│       ├── static/          # CSS, JS files
│       ├── templates/       # Thymeleaf templates
│       └── application.properties
└── test/
    └── java/                # Test files
```

## Development

### Building

```bash
mvn clean compile
```

### Running Tests

```bash
mvn test
```

### Building JAR

```bash
mvn clean package
```

The application JAR will be created in the `target/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please use the GitHub issue tracker.