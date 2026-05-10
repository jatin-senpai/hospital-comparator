import { useState } from 'react'
import SearchPage from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'
import BookingPage from './pages/BookingPage'
import LandingPage from './pages/LandingPage'
import HistoryPage from './pages/HistoryPage'
import { useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'

export default function App() {
  const { user } = useContext(AuthContext)
  const [page, setPage] = useState(user ? 'search' : 'landing')
  const [searchState, setSearchState] = useState({ query: '', serviceId: '', city: null })
  const [bookingState, setBookingState] = useState({ hospital: null, serviceId: '' })

  useEffect(() => {
    if (user && page === 'landing') {
      setPage('search')
    } else if (!user && page !== 'landing') {
      setPage('landing')
    }
  }, [user])

  const handleSearch = (query, serviceId, city) => {
    setSearchState({ query, serviceId, city })
    setPage('results')
  }

  const handleBook = (hospital, serviceId) => {
    setBookingState({ hospital, serviceId })
    setPage('booking')
  }

  return (
    <>
      {page === 'search' && (
        <SearchPage 
          onSearch={handleSearch} 
          onLogin={() => setPage('landing')}
          onHistory={() => setPage('history')}
        />
      )}
      {page === 'results' && (
        <ResultsPage
          query={searchState.query}
          serviceId={searchState.serviceId}
          city={searchState.city}
          onBook={handleBook}
          onBack={() => setPage('search')}
        />
      )}
      {page === 'booking' && (
        <BookingPage
          hospital={bookingState.hospital}
          serviceId={bookingState.serviceId}
          onBack={() => setPage('results')}
          onConfirm={() => setPage('history')}
          onLoginReq={() => setPage('landing')}
        />
      )}
      {page === 'landing' && (
        <LandingPage
          onSuccess={() => setPage('search')}
        />
      )}
      {page === 'history' && (
        <HistoryPage
          onBack={() => setPage('search')}
        />
      )}
    </>
  )
}
