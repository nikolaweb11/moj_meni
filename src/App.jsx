import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import NewTrip from './pages/NewTrip'
import TripDetail from './pages/TripDetail'
import BucketList from './pages/BucketList'
import Settings from './pages/Settings'
import Explore from './pages/Explore'
import BackgroundPhoto from './components/BackgroundPhoto'
import { useFirebaseSync } from './hooks/useFirebaseSync'

function FirebaseSync() {
  useFirebaseSync()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <FirebaseSync />
        <BackgroundPhoto />
        <div className="relative z-10">
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/trips/new" element={<NewTrip />} />
              <Route path="/trips/:id" element={<TripDetail />} />
              <Route path="/bucket-list" element={<BucketList />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
