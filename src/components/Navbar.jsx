import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../AuthModal";
import "./Navbar.css";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // "login" | "register"
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { 
    setMenuOpen(false); 
  }, [location]);

  const handleLogout = () => { 
    logout(); 
    setUserMenu(false); 
    navigate("/"); 
  };

  return (
    <>
      <nav className={`navbar ${scrolled || !isHome ? "navbar--solid" : ""} ${menuOpen ? "navbar--open" : ""}`}>
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-symbol">✦</span>
            <span className="navbar__logo-text">WanderLux</span>
          </Link>

          <ul className="navbar__links">
            <li><Link to="/tours">Experiences</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Concierge</Link></li>
          </ul>

          <div className="navbar__actions">
            {user ? (
              <div className="navbar__user">
                <button className="navbar__user-btn" onClick={() => setUserMenu(!userMenu)}>
                  <div className="navbar__avatar">{user.name[0].toUpperCase()}</div>
                  <span>{user.name.split(" ")[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8L1 3h10z"/>
                  </svg>
                </button>
                {userMenu && (
                  <div className="navbar__dropdown">
                    <Link to="/my-bookings" onClick={() => setUserMenu(false)}>My Journeys</Link>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="navbar__signin" onClick={() => setAuthModal("login")}>Sign In</button>
                <button className="btn btn-gold" onClick={() => setAuthModal("register")}>Join</button>
              </>
            )}
          </div>

          <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className="navbar__mobile">
          <ul>
            <li><Link to="/tours">Experiences</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Concierge</Link></li>
            {user ? (
              <>
                <li><Link to="/my-bookings">My Journeys</Link></li>
                <li><button onClick={handleLogout}>Sign Out</button></li>
              </>
            ) : (
              <>
                <li><button onClick={() => { setAuthModal("login"); setMenuOpen(false); }}>Sign In</button></li>
                <li><button onClick={() => { setAuthModal("register"); setMenuOpen(false); }}>Create Account</button></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={setAuthModal} />}
    </>
  );
}