export const CITIES = [
  { id: 'jaipur', name: 'Jaipur', latitude: 26.9124, longitude: 75.7873 },
  { id: 'delhi', name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
  { id: 'mumbai', name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
]

export const SERVICES = [
  { id: 'xray', label: 'X-Ray', icon: '◈', category: 'Imaging' },
  { id: 'mri', label: 'MRI Scan', icon: '◉', category: 'Imaging' },
  { id: 'ct', label: 'CT Scan', icon: '◎', category: 'Imaging' },
  { id: 'blood', label: 'Blood Test', icon: '◆', category: 'Pathology' },
  { id: 'urine', label: 'Urine Test', icon: '◇', category: 'Pathology' },
  { id: 'ecg', label: 'ECG', icon: '◈', category: 'Cardiology' },
  { id: 'ultrasound', label: 'Ultrasound', icon: '◉', category: 'Imaging' },
  { id: 'thyroid', label: 'Thyroid Panel', icon: '◆', category: 'Pathology' },
]

export const HOSPITALS = [
  {
    id: 1,
    name: 'Apollo Diagnostics',
    tagline: 'Precision. Speed. Care.',
    address: 'Sector 12, Jaipur',
    distance: 1.2,
    rating: 4.8,
    reviews: 2341,
    badge: 'NABH Accredited',
    badgeColor: 'teal',
    established: 2008,
    openNow: true,
    hours: '6:00 AM – 10:00 PM',
    phone: '+91 98100 12345',
    image: 'apollo',
    services: {
      xray: { price: 350, duration: 15, available: true, report: '2 hrs' },
      mri: { price: 4500, duration: 45, available: true, report: '24 hrs' },
      ct: { price: 3200, duration: 30, available: true, report: '6 hrs' },
      blood: { price: 180, duration: 10, available: true, report: '6 hrs' },
      urine: { price: 120, duration: 5, available: true, report: '4 hrs' },
      ecg: { price: 250, duration: 20, available: true, report: '1 hr' },
      ultrasound: { price: 800, duration: 25, available: true, report: '2 hrs' },
      thyroid: { price: 650, duration: 10, available: true, report: '12 hrs' },
    },
    slots: generateSlots(9),
  },
  {
    id: 2,
    name: 'Fortis Health Hub',
    tagline: 'Excellence in Every Test.',
    address: 'Malviya Nagar, Jaipur',
    distance: 2.7,
    rating: 4.6,
    reviews: 1892,
    badge: 'ISO Certified',
    badgeColor: 'amber',
    established: 2012,
    openNow: true,
    hours: '7:00 AM – 9:00 PM',
    phone: '+91 98200 56789',
    image: 'fortis',
    services: {
      xray: { price: 299, duration: 15, available: true, report: '3 hrs' },
      mri: { price: 3999, duration: 50, available: true, report: '24 hrs' },
      ct: { price: 2800, duration: 35, available: true, report: '8 hrs' },
      blood: { price: 149, duration: 10, available: true, report: '8 hrs' },
      urine: { price: 99, duration: 5, available: true, report: '6 hrs' },
      ecg: { price: 199, duration: 20, available: false, report: '2 hrs' },
      ultrasound: { price: 699, duration: 30, available: true, report: '3 hrs' },
      thyroid: { price: 599, duration: 10, available: true, report: '12 hrs' },
    },
    slots: generateSlots(11),
  },
  {
    id: 3,
    name: 'Max LifeCare Center',
    tagline: 'Advanced. Affordable. Accessible.',
    address: 'C-Scheme, Jaipur',
    distance: 3.4,
    rating: 4.5,
    reviews: 987,
    badge: 'CAP Certified',
    badgeColor: 'chalk',
    established: 2016,
    openNow: false,
    hours: '8:00 AM – 8:00 PM',
    phone: '+91 98300 11223',
    image: 'max',
    services: {
      xray: { price: 250, duration: 20, available: true, report: '4 hrs' },
      mri: { price: 3500, duration: 60, available: true, report: '48 hrs' },
      ct: { price: 2500, duration: 40, available: true, report: '12 hrs' },
      blood: { price: 120, duration: 15, available: true, report: '12 hrs' },
      urine: { price: 80, duration: 5, available: true, report: '8 hrs' },
      ecg: { price: 180, duration: 25, available: true, report: '3 hrs' },
      ultrasound: { price: 599, duration: 30, available: true, report: '4 hrs' },
      thyroid: { price: 499, duration: 15, available: true, report: '24 hrs' },
    },
    slots: generateSlots(13),
  },
  {
    id: 4,
    name: 'Medanta Diagnostics',
    tagline: 'Where Science Meets Compassion.',
    address: 'Vaishali Nagar, Jaipur',
    distance: 4.1,
    rating: 4.9,
    reviews: 3102,
    badge: 'NABL Accredited',
    badgeColor: 'teal',
    established: 2005,
    openNow: true,
    hours: '5:30 AM – 11:00 PM',
    phone: '+91 98400 77889',
    image: 'medanta',
    services: {
      xray: { price: 400, duration: 10, available: true, report: '1 hr' },
      mri: { price: 5200, duration: 40, available: true, report: '12 hrs' },
      ct: { price: 3800, duration: 25, available: true, report: '4 hrs' },
      blood: { price: 220, duration: 8, available: true, report: '4 hrs' },
      urine: { price: 150, duration: 5, available: true, report: '2 hrs' },
      ecg: { price: 300, duration: 15, available: true, report: '30 min' },
      ultrasound: { price: 950, duration: 20, available: true, report: '1 hr' },
      thyroid: { price: 750, duration: 8, available: true, report: '6 hrs' },
    },
    slots: generateSlots(7),
  },
]

function generateSlots(startHour) {
  const today = new Date()
  const slots = []
  for (let d = 0; d < 3; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() + d)
    const daySlots = []
    for (let h = startHour; h < startHour + 8; h++) {
      const hour = h % 24
      if (hour < 6 || hour > 22) continue
      daySlots.push({
        id: `${d}-${h}`,
        time: `${hour.toString().padStart(2,'0')}:00`,
        label: hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour-12}:00 PM`,
        available: Math.random() > 0.3,
        date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        dateObj: date,
      })
    }
    slots.push({ date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }), slots: daySlots })
  }
  return slots
}

export const QUICK_SEARCHES = [
  'X-Ray near me', 'Blood Test price', 'MRI Scan', 'CT Scan', 'ECG test', 'Ultrasound', 'Thyroid Panel'
]
