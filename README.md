# Viglet Search

A powerful content indexing and search platform built with Spring Boot and Apache Lucene, now featuring a modern React frontend.

## Features

- **Content Management**: Create, read, update, and delete content items
- **Full-Text Search**: Advanced search capabilities powered by Apache Lucene
- **REST API**: Complete REST API for programmatic access
- **Modern Web Interface**: React-based frontend with shadcn/ui components
- **Search Highlighting**: Results include highlighted search terms
- **Filter Search**: Search by category, author, and text content
- **Real-time Indexing**: Content is automatically indexed when created or updated
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

### Backend
- **Spring Boot**: 3.2.0
- **Search Engine**: Apache Lucene 9.8.0
- **Database**: H2 Database (embedded)
- **ORM**: Spring Data JPA
- **Build Tool**: Maven

### Frontend
- **React**: 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router

## Quick Start

### Prerequisites

- Java 17 or later
- Maven 3.6 or later
- Node.js 18 or later (for frontend development)

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

## Frontend Development

The React frontend is located in the `frontend/` directory and is automatically built during the Maven build process.

### Development Mode

For frontend development with hot reload:

1. Start the Spring Boot backend:
```bash
mvn spring-boot:run
```

2. In a separate terminal, start the frontend development server:
```bash
cd frontend
npm install
npm run dev
```

3. Open your browser to:
```
http://localhost:3000
```

The development server will proxy API requests to the Spring Boot backend at `http://localhost:8080`.

### Manual Frontend Build

To manually build the frontend:

```bash
cd frontend
npm install
npm run build
```

The built files will be placed in `src/main/resources/static/` and served by Spring Boot.

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

The modern React frontend provides:

- **Homepage**: Welcome page with statistics and recent content
- **Content Management**: Full CRUD operations with intuitive forms
- **Content List**: Paginated view of all content with search and filters
- **Content Detail**: Rich view of individual content items with metadata
- **Advanced Search**: Comprehensive search with multiple filters
- **Search Results**: Highlighted results with relevance scores
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean interface built with shadcn/ui components

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
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Business logic
│   └── resources/
│       ├── static/          # Built React frontend
│       └── application.properties
├── test/
│   └── java/                # Test files
└── frontend/                # React frontend source
    ├── src/
    │   ├── components/      # React components
    │   │   └── ui/          # shadcn/ui components
    │   ├── pages/           # Page components
    │   ├── lib/             # Utilities and API client
    │   ├── types/           # TypeScript definitions
    │   └── hooks/           # Custom React hooks
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
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