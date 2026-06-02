import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">✦ WanderLux</div>
            <p>Crafting extraordinary journeys for the discerning traveler since 2015. Every itinerary is a masterpiece.</p>
            <div className="footer__socials">
              {
                ["Instagram", "Pinterest", "Twitter"].map(s => (
                <a key={s} href="#" className="footer__social">{s[0]}</a>
              ))
              }
            </div>
          </div>

          <div className="footer__col">
            <h4>Destinations</h4>
            <ul>
              {["Asia & Pacific", "Europe", "Africa & Safari", "Americas", "Middle East"].map(d => (
                <li key={d}>
                  <Link to="/tours">{d}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Experiences</h4>
            <ul>
              {["Luxury Escapes", "Adventure Tours", "Cultural Journeys", "Wildlife Safaris", "Honeymoon Packages"].map(e => (
                <li key={e}>
                  <Link to="/tours">{e}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              {[["Our Story", "/about"], ["Concierge", "/contact"], ["Press & Media", "#"], ["Careers", "#"], ["Sustainability", "#"]].map(([label, href]) => (
                <li key={label}>
                    <Link to={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__newsletter">
          <div>
            <h3>Private Travel Intelligence</h3>
            <p>Exclusive destinations, hidden gems, and curated offers — delivered monthly.</p>
          </div>
          <div className="footer__newsletter-form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn btn-gold">Subscribe</button>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2024 WanderLux Travel. All rights reserved.</p>
          <div className="footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}