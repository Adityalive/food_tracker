import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="uiverse-navbar">
      <div className="uiverse-logo">Calorie-track</div>

      <ul className="uiverse-nav-links">
        <li><a href="#Home">Home</a></li>
        <li><a href="#Feature">Feature</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      {/* Opens signup in NEW TAB */}
      <Link
        to="/signup"
        target="_blank"
        rel="noopener noreferrer"
        className="uiverse-btn"
      >
        Sign Up
      </Link>
    </nav>
  );
}
