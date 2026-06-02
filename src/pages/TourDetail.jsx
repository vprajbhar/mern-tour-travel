import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../hooks/userApi";
import { useAuth } from "../context/AuthContext";
import "./TourDetail.css";

export default function TourDetail() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tourRes, revRes] = await Promise.all([
          api.get(`/tours/${id}`),
          api.get(`/reviews/tour/${id}`),
        ]);
        setTour(tourRes.data);
        setReviews(revRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!tour) return <div className="page-loader"><p>Tour not found</p></div>;

  const allImages = [tour.coverImage, ...(tour.images || [])].filter(Boolean);
  const stars = "★".repeat(Math.floor(tour.rating)) + (tour.rating % 1 >= 0.5 ? "½" : "");

  return (
    <div className="tour-detail">
      {/* Gallery Hero */}
      <div className="td-gallery">
        <div className="td-gallery__main">
          <img src={allImages[activeImage] || tour.coverImage} alt={tour.title} />
          <div className="td-gallery__overlay" />
          <div className="td-gallery__meta">
            <div className="td-gallery__badges">
              {tour.badge && <span className={`badge badge-gold`}>{tour.badge}</span>}
              <span className="badge badge-ink">{tour.category}</span>
              <span className="badge badge-sage">{tour.difficulty}</span>
            </div>
          </div>
        </div>
        {allImages.length > 1 && (
          <div className="td-gallery__thumbs">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`View ${i + 1}`}
                className={i === activeImage ? "active" : ""}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container td-layout">
        {/* Main Content */}
        <div className="td-main">
          {/* Header */}
          <div className="td-header">
            <div className="td-header__location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {tour.destination}, {tour.country}
            </div>
            <h1 className="td-header__title">{tour.title}</h1>
            <div className="td-header__meta">
              <span className="stars">{stars}</span>
              <strong>{tour.rating}</strong>
              <span>({tour.reviewCount} reviews)</span>
              <span className="td-header__dot">·</span>
              <span>{tour.duration} days</span>
              <span className="td-header__dot">·</span>
              <span>Max {tour.groupSize} travelers</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="td-tabs">
            {["overview", "itinerary", "included", "reviews"].map(tab => (
              <button
                key={tab}
                className={`td-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "reviews" && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="td-section animate-fade-up">
              <p className="td-description">{tour.longDescription || tour.description}</p>

              {tour.highlights?.length > 0 && (
                <div className="td-highlights">
                  <h3>Highlights</h3>
                  <ul>
                    {tour.highlights.map((h, i) => (
                      <li key={i}>
                        <span className="td-highlight-dot">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="td-section animate-fade-up">
              {tour.itinerary?.length > 0 ? (
                <div className="td-itinerary">
                  {tour.itinerary.map((day, i) => (
                    <div key={i} className="td-itinerary__day">
                      <div className="td-itinerary__num">Day {day.day}</div>
                      <div className="td-itinerary__content">
                        <h4>{day.title}</h4>
                        <p>{day.description}</p>
                        {day.accommodation && (
                          <div className="td-itinerary__stay">🏨 {day.accommodation}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--mist)", fontStyle: "italic" }}>
                  Detailed day-by-day itinerary available upon booking. Contact our concierge for full details.
                </p>
              )}
            </div>
          )}

          {activeTab === "included" && (
            <div className="td-section animate-fade-up">
              <div className="td-included-grid">
                {tour.included?.length > 0 && (
                  <div>
                    <h3>✓ What's Included</h3>
                    <ul className="td-list td-list--yes">
                      {tour.included.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {tour.excluded?.length > 0 && (
                  <div>
                    <h3>✕ Not Included</h3>
                    <ul className="td-list td-list--no">
                      {tour.excluded.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="td-section animate-fade-up">
              {reviews.length === 0 ? (
                <p style={{ color: "var(--mist)" }}>No reviews yet. Be the first to share your experience!</p>
              ) : (
                <div className="td-reviews">
                  {reviews.map(r => (
                    <div key={r._id} className="td-review">
                      <div className="td-review__header">
                        <div className="td-review__avatar">{r.user?.name?.[0] || "A"}</div>
                        <div>
                          <div className="td-review__name">{r.user?.name || "Anonymous"}</div>
                          <div className="stars" style={{ fontSize: 13 }}>{"★".repeat(r.rating)}</div>
                        </div>
                        <span className="td-review__date">
                          {new Date(r.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {r.title && <h4 className="td-review__title">{r.title}</h4>}
                      <p className="td-review__body">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Card */}
        <aside className="td-booking-card">
          <div className="td-booking-card__price">
            {tour.originalPrice && (
              <span className="td-booking-card__original">${tour.originalPrice.toLocaleString()}</span>
            )}
            <span className="td-booking-card__main">${tour.price.toLocaleString()}</span>
            <span className="td-booking-card__per">per person</span>
          </div>

          <div className="td-booking-card__details">
            {[
              { icon: "📅", label: "Duration", val: `${tour.duration} days` },
              { icon: "👥", label: "Group Size", val: `Max ${tour.groupSize}` },
              { icon: "🏔", label: "Difficulty", val: tour.difficulty },
              { icon: "⭐", label: "Rating", val: `${tour.rating} (${tour.reviewCount} reviews)` },
            ].map(d => (
              <div key={d.label} className="td-booking-card__detail">
                <span>{d.icon} {d.label}</span>
                <strong>{d.val}</strong>
              </div>
            ))}
          </div>

          {tour.startDates?.length > 0 && (
            <div className="td-booking-card__dates">
              <label>Available Dates</label>
              <div className="td-dates">
                {tour.startDates.map((d, i) => (
                  <span key={i} className="td-date">
                    {new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn btn-gold td-book-btn"
            onClick={() => user ? navigate(`/book/${tour._id}`) : window.dispatchEvent(new CustomEvent("openAuth", { detail: "login" }))}
          >
            Book This Journey
          </button>
          <Link to="/contact" className="btn btn-outline td-enquire-btn">Enquire Now</Link>

          <p className="td-booking-card__note">
            ✓ Free cancellation up to 30 days before · Secure payment
          </p>
        </aside>
      </div>
    </div>
  );
}