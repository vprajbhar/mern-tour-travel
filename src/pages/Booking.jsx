import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../hooks/userApi";
import { useAuth } from "../context/AuthContext";
import "../pages/Booking.css";

export default function Booking() {
  const { tourId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    startDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
    phone: "",
    emergencyContact: "",
  });

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    api.get(`/tours/${tourId}`).then(r => setTour(r.data)).finally(() => setLoading(false));
  }, [tourId, user]);

  const totalPrice = tour
    ? tour.price * (Number(form.adults) + Number(form.children) * 0.7)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate) { setError("Please select a start date"); return; }
    setSubmitting(true); setError("");
    try {
      await api.post("/bookings", {
        tourId,
        startDate: form.startDate,
        travelers: { adults: Number(form.adults), children: Number(form.children) },
        specialRequests: form.specialRequests,
        contactInfo: { phone: form.phone, emergencyContact: form.emergencyContact },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!tour) return <div className="page-loader"><p>Tour not found</p></div>;

  if (success) return (
    <div className="booking-success">
      <div className="booking-success__card">
        <div className="booking-success__icon">✦</div>
        <h2>Journey Confirmed!</h2>
        <p>Your booking for <strong>{tour.title}</strong> has been confirmed. Our concierge team will be in touch within 24 hours with your detailed travel documents.</p>
        <div className="booking-success__total">Total: ${totalPrice.toLocaleString()}</div>
        <div className="booking-success__actions">
          <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
          <Link to="/tours" className="btn btn-outline">Explore More</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-breadcrumb">
          <Link to="/tours">Experiences</Link>
          <span>›</span>
          <Link to={`/tours/${tourId}`}>{tour.title}</Link>
          <span>›</span>
          <span>Book</span>
        </div>

        <div className="booking-layout">
          <div className="booking-form-wrap">
            <h1 className="booking-title">Complete Your Booking</h1>
            <p className="booking-sub">Fill in your details and we'll take care of everything else.</p>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="booking-section">
                <h3>Travel Dates & Travelers</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row form-row--2">
                  <div className="form-group">
                    <label>Adults</label>
                    <select value={form.adults} onChange={e => setForm({ ...form, adults: e.target.value })}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Children (under 12)</label>
                    <select value={form.children} onChange={e => setForm({ ...form, children: e.target.value })}>
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} {n === 1 ? "Child" : "Children"}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel" placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact</label>
                    <input
                      type="text" placeholder="Name & phone number"
                      value={form.emergencyContact}
                      onChange={e => setForm({ ...form, emergencyContact: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h3>Special Requests</h3>
                <div className="form-group">
                  <label>Dietary Requirements, Accessibility Needs, Preferences</label>
                  <textarea
                    rows={4}
                    placeholder="Let us know anything that would help us customize your experience..."
                    value={form.specialRequests}
                    onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                  />
                </div>
              </div>

              {error && <div className="booking-error">{error}</div>}

              <button type="submit" className="btn btn-gold booking-submit" disabled={submitting}>
                {submitting ? "Processing..." : `Confirm Booking — $${totalPrice.toLocaleString()}`}
              </button>

              <p className="booking-note">
                By booking you agree to our Terms & Conditions. Free cancellation up to 30 days before your start date.
              </p>
            </form>
          </div>

          {/* Summary Card */}
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <img src={tour.coverImage} alt={tour.title} className="booking-summary__img" />
            <h4 className="booking-summary__title">{tour.title}</h4>
            <p className="booking-summary__location">
              📍 {tour.destination}, {tour.country}
            </p>

            <div className="booking-summary__details">
              {[
                { l: "Duration", v: `${tour.duration} days` },
                { l: "Category", v: tour.category },
                { l: "Difficulty", v: tour.difficulty },
                { l: "Adults", v: `${form.adults} × $${tour.price.toLocaleString()}` },
                form.children > 0 && { l: "Children", v: `${form.children} × $${Math.round(tour.price * 0.7).toLocaleString()}` },
              ].filter(Boolean).map(d => (
                <div key={d.l} className="booking-summary__row">
                  <span>{d.l}</span>
                  <span>{d.v}</span>
                </div>
              ))}
            </div>

            <div className="booking-summary__total">
              <span>Total</span>
              <strong>${totalPrice.toLocaleString()}</strong>
            </div>

            <div className="booking-summary__assurance">
              {["Secure SSL payment", "Instant confirmation", "24/7 support"].map(a => (
                <div key={a} className="booking-summary__assurance-item">
                  <span>✓</span> {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}