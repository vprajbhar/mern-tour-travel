import { Link } from "react-router-dom";
import "./TourCard.css";

const BADGE_CLASS = { bestseller: "badge-gold", new: "badge-sage", limited: "badge-terracotta" };
const CATEGORY_ICON = {
  Adventure: "⛰", Cultural: "🏛", Beach: "🏖", Wildlife: "🦁",
  Luxury: "✦", Honeymoon: "♡", Trekking: "🥾",
};

export default function TourCard({ tour, delay = 0 }) {
  
  const stars = "★".repeat(Math.floor(tour.rating)) + (tour.rating % 1 >= 0.5 ? "½" : "");

  return (
    <article
      className="tour-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link to={`/tours/${tour._id}`} className="tour-card__image-wrap">
        <img
          src={tour.coverImage || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80`}
          alt={tour.title}
          className="tour-card__image"
          loading="lazy"
        />
        <div className="tour-card__image-overlay" />
        {tour.badge && (
          <span className={`badge ${BADGE_CLASS[tour.badge] || "badge-ink"} tour-card__badge`}>
            {tour.badge}
          </span>
        )}
        <div className="tour-card__category">
          <span>{CATEGORY_ICON[tour.category]}</span>
          <span>{tour.category}</span>
        </div>
      </Link>

      <div className="tour-card__body">
        <div className="tour-card__meta">
          <span className="tour-card__location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {tour.destination}, {tour.country}
          </span>
          <span className="tour-card__duration">{tour.duration}D</span>
        </div>

        <Link to={`/tours/${tour._id}`}>
          <h3 className="tour-card__title">{tour.title}</h3>
        </Link>

        <p className="tour-card__desc">{tour.description.slice(0, 100)}...</p>

        <div className="tour-card__footer">
          <div className="tour-card__rating">
            <span className="stars">{stars}</span>
            <span className="tour-card__rating-val">{tour.rating}</span>
            <span className="tour-card__review-count">({tour.reviewCount})</span>
          </div>
          <div className="tour-card__price">
            {tour.originalPrice && (
              <span className="tour-card__price-original">${tour.originalPrice.toLocaleString()}</span>
            )}
            <span className="tour-card__price-main">${tour.price.toLocaleString()}</span>
            <span className="tour-card__price-per">/person</span>
          </div>
        </div>

        <div className="tour-card__actions">
          <Link to={`/tours/${tour._id}`} className="btn btn-outline tour-card__btn">Explore</Link>
          <Link to={`/book/${tour._id}`} className="btn btn-primary tour-card__btn">Book Now</Link>
        </div>
      </div>
    </article>
  );
}