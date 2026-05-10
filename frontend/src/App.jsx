import { useState } from 'react'
import SearchPage from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  const [page, setPage] = useState('search')
  const [searchState, setSearchState] = useState({ query: '', serviceId: '', city: null })
  const [bookingState, setBookingState] = useState({ hospital: null, serviceId: '' })

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
          onLogin={() => setPage('login')}
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
          onLoginReq={() => setPage('login')}
        />
      )}
      {page === 'login' && (
        <LoginPage
          onBack={() => setPage('search')}
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
