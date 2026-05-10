const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  
  // Try to parse JSON, if it fails return empty object
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

export const api = {
  login: (credentials) => fetchWithAuth('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  sendOTP: (phone) => fetchWithAuth('/api/v1/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  }),
  verifyOTP: (phone, otp) => fetchWithAuth('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  }),
  searchHospitals: (service, lat, lng) => fetchWithAuth(`/api/v1/hospitals/search?service=${service}&lat=${lat}&lng=${lng}`),
  getHospital: (id) => fetchWithAuth(`/api/v1/hospitals/${id}`),
  getBookingHistory: () => fetchWithAuth('/api/v1/bookings/history'),
  createBooking: (bookingData) => fetchWithAuth('/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  processPayment: (paymentData) => fetchWithAuth('/api/v1/payments/process', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  downloadReport: async (bookingRef) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingRef}/report`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to download report');
    
    // Create a blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediQ_Report_${bookingRef}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
