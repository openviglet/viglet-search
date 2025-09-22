import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ContentListPage } from './pages/ContentListPage'
import { ContentDetailPage } from './pages/ContentDetailPage'
import { ContentEditPage } from './pages/ContentEditPage'
import { SearchPage } from './pages/SearchPage'
import './index.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/content" element={<ContentListPage />} />
          <Route path="/content/new" element={<ContentEditPage />} />
          <Route path="/content/:id" element={<ContentDetailPage />} />
          <Route path="/content/:id/edit" element={<ContentEditPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App