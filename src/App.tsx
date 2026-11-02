import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { MatchupPage } from './pages/MatchupPage'
import { RecommendationPage } from './pages/RecommendationPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MatchupPage />} />
        <Route path="build" element={<RecommendationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
