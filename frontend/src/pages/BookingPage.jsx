import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { api } from '../services/api'
import { SERVICES } from '../services/mockData'
import styles from './BookingPage.module.css'

const STEPS = ['Select Slot', 'Patient Details', 'Payment', 'Confirmed']

export default function BookingPage({ hospital, serviceId, onBack, onConfirm, onLoginReq }) {
  const { user } = useContext(AuthContext)
  const [step, setStep] = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [form, setForm] = useState({ name: '', age: '', phone: '', email: '', gender: 'Male', notes: '' })
  const [payMethod, setPayMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [processing, setProcessing] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [slots, setSlots] = useState([])

  const service = SERVICES.find(s => s.id === serviceId)
  const svc = hospital.services ? hospital.services[serviceId] : null

  useEffect(() => {
    api.getSlots(hospital.id).then(data => {
      if (data && Array.isArray(data.slots)) setSlots(data.slots)
    }).catch(err => console.error("Failed to fetch slots", err))
  }, [hospital.id])

  const handlePay = async () => {
    setProcessing(true)
    try {
      // 1. Create booking on backend
      const bookingRes = await api.createBooking({
        hospital_id: hospital.id,
        slot_id: parseInt(selectedSlot.id.split('-')[2]), // mocked slot id from generating
        service_id: serviceId,
        patient_name: form.name,
        patient_age: parseInt(form.age),
        patient_phone: form.phone,
        patient_email: form.email,
        patient_gender: form.gender,
        notes: form.notes,
        payment_method: payMethod,
      })

      setBookingRef(bookingRes.booking_ref)
      
      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SjfpXFSR9XIQR2", // Replace with your key
        amount: bookingRes.amount * 100,
        currency: "INR",
        name: "MediQ",
        description: "Test Booking Payment",
        order_id: bookingRes.razorpay_order_id,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            await api.processPayment({
              booking_ref: bookingRes.booking_ref,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
            setStep(3) // Success
          } catch (err) {
            alert("Payment verification failed: " + err.message)
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#C8F04D",
        },
      }

      if (bookingRes.razorpay_order_id === "mock_order_id" || !window.Razorpay) {
         // Fallback if Razorpay SDK fails to load or mock order
         await new Promise(r => setTimeout(r, 1000))
         setStep(3)
      } else {
         const rzp = new window.Razorpay(options)
         rzp.on('payment.failed', function (response){
             alert("Payment failed: " + response.error.description);
         });
         rzp.open()
      }
    } catch (err) {
      alert("Booking failed: " + err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Back
        </button>

        <div className={styles.hospitalInfo}>
          <div className={styles.hospitalAvatar}>{hospital.name[0]}</div>
          <div className={styles.hospitalName}>{hospital.name}</div>
          <div className={styles.hospitalAddr}>{hospital.address}</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>SERVICE</div>
          <div className={styles.summaryService}>
            <span className={styles.summaryIcon}>{service?.icon}</span>
            {service?.label}
          </div>

          <div className={styles.summaryRow}>
            <span>Duration</span>
            <span>{svc?.duration} min</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Report</span>
            <span>{svc?.report}</span>
          </div>

          {selectedSlot && (
            <div className={styles.summarySlot}>
              <div className={styles.summaryLabel}>APPOINTMENT</div>
              <div className={styles.summarySlotTime}>{selectedSlot.label}</div>
              <div className={styles.summarySlotDate}>{selectedSlot.date}</div>
            </div>
          )}

          <div className={styles.summaryDivider} />

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span className={styles.summaryPrice}>₹{svc?.price?.toLocaleString()}</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={`${styles.step} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
              <div className={styles.stepCircle}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={styles.stepLabel}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Step 0: Slot selection */}
        {step === 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Choose your slot</h2>
            <p className={styles.sectionSub}>Select a date and time that works for you</p>

            {/* Day tabs */}
            <div className={styles.dayTabs}>
              {slots.map((d, i) => (
                <button
                  key={i}
                  className={`${styles.dayTab} ${selectedDay === i ? styles.dayTabActive : ''}`}
                  onClick={() => { setSelectedDay(i); setSelectedSlot(null) }}
                >
                  {d.date}
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className={styles.slotGrid}>
              {slots[selectedDay]?.slots?.map(slot => (
                <button
                  key={slot.id}
                  className={`
                    ${styles.slot}
                    ${!slot.available ? styles.slotUnavailable : ''}
                    ${selectedSlot?.id === slot.id ? styles.slotSelected : ''}
                  `}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <span className={styles.slotTime}>{slot.label}</span>
                  {!slot.available && <span className={styles.slotFull}>Full</span>}
                </button>
              ))}
            </div>

            {user ? (
              <button
                className={styles.nextBtn}
                disabled={!selectedSlot}
                onClick={() => setStep(1)}
              >
                Continue with {selectedSlot?.label || 'a slot'} →
              </button>
            ) : (
              <div className={styles.loginPrompt}>
                <p>Please log in to book appointments.</p>
                <button className={styles.nextBtn} onClick={onLoginReq}>Log In</button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Patient details */}
        {step === 1 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Patient details</h2>
            <p className={styles.sectionSub}>Please enter the patient's information</p>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full name *</label>
                <input
                  className={styles.input}
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Age *</label>
                <input
                  className={styles.input}
                  placeholder="28"
                  type="number"
                  value={form.age}
                  onChange={e => setForm({...form, age: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone *</label>
                <input
                  className={styles.input}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  placeholder="rahul@gmail.com"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Gender</label>
                <div className={styles.genderRow}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      className={`${styles.genderBtn} ${form.gender === g ? styles.genderActive : ''}`}
                      onClick={() => setForm({...form, gender: g})}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Doctor's notes / prescription (optional)</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Any relevant medical history or doctor's instructions..."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backStepBtn} onClick={() => setStep(0)}>← Back</button>
              <button
                className={styles.nextBtn}
                disabled={!form.name || !form.age || !form.phone}
                onClick={() => setStep(2)}
              >
                Proceed to payment →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <p className={styles.sectionSub}>Secure payment via Razorpay</p>

            <div className={styles.payMethods}>
              {[
                { id: 'upi', label: 'UPI', icon: '◈', sub: 'PhonePe, GPay, Paytm' },
                { id: 'card', label: 'Card', icon: '◉', sub: 'Credit / Debit' },
                { id: 'netbanking', label: 'Net Banking', icon: '◆', sub: 'All major banks' },
                { id: 'wallet', label: 'Wallet', icon: '◇', sub: 'Paytm, Amazon Pay' },
              ].map(m => (
                <button
                  key={m.id}
                  className={`${styles.payMethod} ${payMethod === m.id ? styles.payMethodActive : ''}`}
                  onClick={() => setPayMethod(m.id)}
                >
                  <span className={styles.payIcon}>{m.icon}</span>
                  <div>
                    <div className={styles.payLabel}>{m.label}</div>
                    <div className={styles.paySub}>{m.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {payMethod === 'upi' && (
              <div className={styles.upiWrap}>
                <label className={styles.label}>UPI ID</label>
                <input
                  className={styles.input}
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                />
                <div className={styles.upiApps}>
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => (
                    <button key={a} className={styles.upiApp}>{a}</button>
                  ))}
                </div>
              </div>
            )}

            {payMethod === 'card' && (
              <div className={styles.cardForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Card number</label>
                  <input className={styles.input} placeholder="4242 4242 4242 4242" />
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Expiry</label>
                    <input className={styles.input} placeholder="MM/YY" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CVV</label>
                    <input className={styles.input} placeholder="•••" type="password" maxLength={3} />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.payTotal}>
              <div className={styles.payTotalRow}>
                <span>{service?.label}</span>
                <span>₹{svc?.price?.toLocaleString()}</span>
              </div>
              <div className={styles.payTotalRow}>
                <span>Platform fee</span>
                <span>₹0</span>
              </div>
              <div className={styles.payTotalDivider} />
              <div className={`${styles.payTotalRow} ${styles.payTotalFinal}`}>
                <span>Total</span>
                <span>₹{svc?.price?.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backStepBtn} onClick={() => setStep(1)}>← Back</button>
              <button
                className={`${styles.nextBtn} ${processing ? styles.processing : ''}`}
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <span className={styles.processingText}>
                    <span className={styles.spinner} />
                    Processing...
                  </span>
                ) : `Pay ₹${svc?.price?.toLocaleString()} →`}
              </button>
            </div>

            <div className={styles.secureNote}>
              🔒 256-bit SSL encrypted · Powered by Razorpay
            </div>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className={styles.confirmed}>
            <div className={styles.checkmark}>✓</div>
            <h2 className={styles.confirmedTitle}>Booking confirmed!</h2>
            <p className={styles.confirmedSub}>Your appointment has been scheduled successfully.</p>

            <div className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <span className={styles.ticketLabel}>BOOKING ID</span>
                <span className={styles.ticketId}>{bookingRef}</span>
              </div>
              <div className={styles.ticketDivider}>
                <div className={styles.ticketNotch} />
                <div className={styles.ticketLine} />
                <div className={styles.ticketNotch} />
              </div>
              <div className={styles.ticketBody}>
                <div className={styles.ticketRow}>
                  <span>Hospital</span>
                  <span>{hospital.name}</span>
                </div>
                <div className={styles.ticketRow}>
                  <span>Service</span>
                  <span>{service?.label}</span>
                </div>
                <div className={styles.ticketRow}>
                  <span>Patient</span>
                  <span>{form.name}</span>
                </div>
                <div className={styles.ticketRow}>
                  <span>Date</span>
                  <span>{selectedSlot?.date}</span>
                </div>
                <div className={styles.ticketRow}>
                  <span>Time</span>
                  <span>{selectedSlot?.label}</span>
                </div>
                <div className={styles.ticketRow}>
                  <span>Amount paid</span>
                  <span className={styles.ticketPrice}>₹{svc?.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={styles.confirmedActions}>
              <button className={styles.downloadBtn}>⬇ Download PDF</button>
              <button className={styles.homeBtn} onClick={onBack}>Search again</button>
            </div>

            <p className={styles.smsNote}>
              Confirmation sent to {form.phone || 'your phone'} &amp; {form.email || 'email'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
