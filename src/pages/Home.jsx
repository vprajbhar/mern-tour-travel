import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../hooks/userApi";
import TourCard from "../components/TourCard";
import "./Home.css";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85",
    location: "Swiss Alps, Switzerland",
    tag: "Mountain Escapes",
  },
  {
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85",
    location: "Santorini, Greece",
    tag: "Island Dreams",
  },
  {
    image: "https://images.unsplash.com/photo-1523592121529-f6dde35f079e?w=1600&q=85",
    location: "Kyoto, Japan",
    tag: "Cultural Immersion",
  },
];

const STATS = [
  { val: "10K+", label: "Happy Travelers" },
  { val: "120+", label: "Destinations" },
  { val: "15", label: "Years of Excellence" },
  { val: "4.9★", label: "Average Rating" },
];

const CATEGORIES = [
  { name: "Adventure", icon: "⛰", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" },
  { name: "Cultural", icon: "🏛", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80" },
  { name: "Wildlife", icon: "🦁", image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=400&q=80" },
  { name: "Luxury", icon: "✦", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" },
  { name: "Trekking", icon: "🥾", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { name: "Beach", icon: "🏖", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
];

const TESTIMONIALS = [
  {
    name: "Sophia Lindström",
    location: "Stockholm, Sweden",
    text: "The Patagonia expedition was beyond anything I've experienced. WanderLux transformed a bucket-list dream into a perfectly orchestrated reality. The guides, the camps, the sheer wildness — I'm still speechless.",
    tour: "Patagonia End of the World Trek",
    rating: 5,
    avatar: "S",
  },
  {
    name: "James Kowalski",
    location: "London, UK",
    text: "From the moment we landed in Bali to the final sunrise at the rice terraces, every detail was flawless. Our guide Wayan was extraordinary. This is the gold standard of luxury travel.",
    tour: "Bali Sacred Temples & Rice Terraces",
    rating: 5,
    avatar: "J",
  },
  {
    name: "Aisha Okonkwo",
    location: "Lagos, Nigeria",
    text: "The Kenya safari exceeded every expectation. Witnessing the Great Migration from a hot air balloon was a spiritual experience. WanderLux doesn't just show you the world — they reveal it.",
    tour: "Kenya & Tanzania Safari Classic",
    rating: 5,
    avatar: "A",
  },
];

export default function Home() {
  
  const [featured, setFeatured] = useState([]);
  const [slide, setSlide] = useState(0);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    api.get("/tours/featured").then(r => setFeatured(r.data)).catch(() => {});
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`hero__slide ${i === slide ? "active" : ""}`}>
            <img src={s.image} alt={s.location} className="hero__bg" />
          </div>
        ))}
        <div className="hero__overlay" />

        <div className="hero__content container">
          <div className="hero__tag animate-fade-in">{HERO_SLIDES[slide].tag}</div>
          <h1 className="hero__title animate-fade-up">
            The World Awaits<br />
            <em>Your Story</em>
          </h1>
          <p className="hero__sub animate-fade-up">
            Curated luxury journeys crafted for those who seek the extraordinary.<br />
            From sacred temples to untamed wilderness — we design memories.
          </p>

          <div className="hero__search animate-fade-up">
            <div className="hero__search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search destinations, experiences..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (window.location.href = `/tours?search=${searchQ}`)}
            />
            <Link to={`/tours?search=${searchQ}`} className="btn btn-gold">Explore</Link>
          </div>

          <div className="hero__dots">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} className={`hero__dot ${i === slide ? "active" : ""}`} onClick={() => setSlide(i)} />
            ))}
          </div>
        </div>

        <div className="hero__location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {HERO_SLIDES[slide].location}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.val} className="stat">
                <div className="stat__val">{s.val}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore by Type</span>
            <h2>Choose Your Adventure</h2>
            <p>From pulse-quickening treks to languid luxury — every travel style has a masterpiece waiting.</p>
          </div>
          <div className="categories__grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/tours?category=${cat.name}`} className="category-card">
                <img src={cat.image} alt={cat.name} className="category-card__img" />
                <div className="category-card__overlay" />
                <div className="category-card__content">
                  <span className="category-card__icon">{cat.icon}</span>
                  <span className="category-card__name">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="section featured-tours">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Editor's Selection</span>
            <h2>Featured Journeys</h2>
            <p>Our most celebrated experiences — handpicked by our travel curators for their exceptional quality.</p>
          </div>
          {featured.length === 0 ? (
            <div className="grid-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 480 }} className="skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {featured.slice(0, 6).map((t, i) => <TourCard key={t._id} tour={t} delay={i * 100} />)}
            </div>
          )}
          <div className="featured-tours__cta">
            <Link to="/tours" className="btn btn-outline">View All Experiences</Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="story-section">
        <div className="container">
          <div className="story__grid">
            <div className="story__images">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80" alt="Travel" className="story__img story__img--main" />
              <img src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&q=80" alt="Journey" className="story__img story__img--accent" />
              <div className="story__badge-float">
                <span>Est.</span>
                <strong>2015</strong>
              </div>
            </div>
            <div className="story__content">
              <span className="section-tag">Our Philosophy</span>
              <h2>Travel as Transformation</h2>
              <p>We believe travel is not merely movement through space — it is movement through self. Every destination we curate, every experience we design, is chosen because it has the power to change how you see the world.</p>
              <p>Our team of seasoned explorers — former diplomats, ethnographers, mountaineers, and chefs — bring unparalleled depth to every itinerary. We don't sell packages; we architect memories.</p>
              <div className="story__features">
                {["Private local experts in 120+ countries", "24/7 concierge support worldwide", "Fully customizable itineraries", "Sustainable & responsible tourism"].map(f => (
                  <div key={f} className="story__feature">
                    <span className="story__feature-dot" />
                    {f}
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Traveler Stories</span>
            <h2>Voices from the Field</h2>
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial">
                <div className="testimonial__stars">{"★".repeat(t.rating)}</div>
                <p className="testimonial__text">"{t.text}"</p>
                <div className="testimonial__footer">
                  <div className="testimonial__avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial__name">{t.name}</div>
                    <div className="testimonial__meta">{t.location} · {t.tour}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-banner__bg" />
        <div className="container cta-banner__content">
          <h2>Your Next Chapter Begins Here</h2>
          <p>Let our travel architects design the journey of a lifetime — bespoke to your desires.</p>
          <div className="cta-banner__actions">
            <Link to="/tours" className="btn btn-gold">Explore Experiences</Link>
            <Link to="/contact" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>Speak to a Curator</Link>
          </div>
        </div>
      </section>
    </div>
  );
}