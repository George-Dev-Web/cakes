// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Velvelt Bloom
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/order"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Order
          </Link>

          <li>
            <Link to="/cakes">Cakes</Link>
          </li>

          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="nav-right">
          <button className="theme-toggle mobile-only" onClick={toggleTheme}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <div className="nav-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
