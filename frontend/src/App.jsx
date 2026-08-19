import { useState, useContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import HospitalDetailDrawer from './components/HospitalDetailDrawer'
import ServiceDetailDrawer from './components/ServiceDetailDrawer'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import ResultsPage from './pages/ResultsPage'
import BookingPage from './pages/BookingPage'
import HistoryPage from './pages/HistoryPage'
import { AuthContext } from './context/AuthContext'
import { HOSPITALS } from './services/mockData'

export default function App() {
  const { user, logout } = useContext(AuthContext)
  const [page, setPage] = useState('landing')
  const [searchState, setSearchState] = useState({ query: '', serviceId: 'blood', city: null })
  const [bookingState, setBookingState] = useState({ hospital: null, serviceId: '' })
  
  // Custom Overlays State
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authCallback, setAuthCallback] = useState(null)
  const [selectedHospitalId, setSelectedHospitalId] = useState(null)
  const [selectedServiceId, setSelectedServiceId] = useState(null)

  // Navigate to sections or pages
  const handleNavigate = (targetPage, sectionId = null) => {
    setPage(targetPage)
    
    // Clear drawers on page transition
    setSelectedHospitalId(null)
    setSelectedServiceId(null)

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }

  const handleSearch = (query, serviceId, city) => {
    setSearchState({ query, serviceId, city })
    setPage('results')
    window.scrollTo(0, 0)
  }

  const handleBook = (hospital, serviceId) => {
    const startBooking = () => {
      setBookingState({ hospital, serviceId })
      setPage('booking')
      window.scrollTo(0, 0)
    }

    if (user) {
      startBooking()
    } else {
      // Prompt login, then resume booking
      setAuthCallback(() => startBooking)
      setAuthModalOpen(true)
    }
  }

  const handleHistoryAccess = () => {
    if (user) {
      setPage('history')
      window.scrollTo(0, 0)
    } else {
      setAuthCallback(() => () => {
        setPage('history')
        window.scrollTo(0, 0)
      })
      setAuthModalOpen(true)
    }
  }

  const handleAuthSuccess = () => {
    if (authCallback) {
      authCallback()
      setAuthCallback(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Navbar (except on distraction-free Booking page) */}
      {page !== 'booking' && (
        <Navbar
          user={user}
          onHistory={handleHistoryAccess}
          onLogout={logout}
          onOpenAuth={() => { setAuthCallback(null); setAuthModalOpen(true); }}
          onNavigate={handleNavigate}
        />
      )}

      {/* Main Pages */}
      <main style={{ flex: '1 0 auto', paddingTop: page !== 'booking' ? '64px' : '0px' }}>
        {page === 'landing' && (
          <LandingPage
            onSearch={handleSearch}
            onSelectHospital={(id) => setSelectedHospitalId(id)}
            onSelectService={(id) => setSelectedServiceId(id)}
          />
        )}
        
        {page === 'results' && (
          <ResultsPage
            query={searchState.query}
            serviceId={searchState.serviceId}
            city={searchState.city}
            onBook={handleBook}
            onBack={() => setPage('landing')}
            onSelectHospital={(id) => setSelectedHospitalId(id)}
            onSelectService={(id) => setSelectedServiceId(id)}
          />
        )}

        {page === 'booking' && (
          <BookingPage
            hospital={bookingState.hospital}
            serviceId={bookingState.serviceId}
            onBack={() => setPage('results')}
            onConfirm={() => setPage('history')}
            onLoginReq={() => {
              setAuthCallback(() => () => setPage('booking'))
              setAuthModalOpen(true)
            }}
          />
        )}

        {page === 'history' && (
          <HistoryPage
            onBack={() => setPage('landing')}
          />
        )}
      </main>

      {/* Global Footer (except on Booking page) */}
      {page !== 'booking' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Modal and Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => { setAuthModalOpen(false); setAuthCallback(null); }}
        onSuccess={handleAuthSuccess}
      />

      {selectedHospitalId && (
        <HospitalDetailDrawer
          hospitalId={selectedHospitalId}
          activeServiceId={searchState.serviceId}
          onClose={() => setSelectedHospitalId(null)}
          onBook={handleBook}
        />
      )}

      {selectedServiceId && (
        <ServiceDetailDrawer
          serviceId={selectedServiceId}
          hospitals={HOSPITALS} // Fallback to mocks for metadata analysis if not searched yet
          onClose={() => setSelectedServiceId(null)}
          onBook={handleBook}
        />
      )}
    </div>
  )
}

