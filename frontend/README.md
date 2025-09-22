# Viglet Search Frontend

Modern React frontend for Viglet Search built with:

- **React 19** - Latest React framework
- **Vite** - Fast build tool and development server  
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Content Management**: Create, edit, view, and delete content
- **Search**: Full-text search with filtering by category and author
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, accessible interface with shadcn/ui components
- **Real-time API Integration**: Communicates with Spring Boot REST API

## API Integration

The frontend communicates with the Spring Boot backend REST API:

- `GET /api/content` - List all content
- `POST /api/content` - Create new content
- `GET /api/content/{id}` - Get content by ID
- `PUT /api/content/{id}` - Update content
- `DELETE /api/content/{id}` - Delete content
- `GET /api/content/search` - Search content
- `POST /api/content/reindex` - Reindex all content

## Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui components
├── pages/            # Page components
├── lib/              # Utilities and API client
├── types/            # TypeScript type definitions
└── hooks/            # Custom React hooks
```