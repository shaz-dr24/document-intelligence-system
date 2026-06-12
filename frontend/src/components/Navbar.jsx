import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    to: "/upload",
    label: "Upload",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    to: "/documents",
    label: "Documents",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: "/chat",
    label: "Ask AI",
    badge: "AI",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Navbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-logo">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="logo-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#818CF8"/>
                <stop offset="100%" stopColor="#4F46E5"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#logo-g)"/>
            <path d="M8 10h16M8 16h10M8 22h13" stroke="white" strokeWidth="2.25" strokeLinecap="round"/>
            <circle cx="24.5" cy="21.5" r="3.5" fill="white" opacity="0.95"/>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">DocIntel</span>
          <span className="brand-tagline">Intelligence Suite</span>
        </div>
      </div>

      <div className="nav-section-label">Navigation</div>

      <ul className="navbar-links">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
            >
              <span className="nav-link-icon">{n.icon}</span>
              <span className="nav-link-label">{n.label}</span>
              {n.badge && <span className="nav-badge">{n.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-divider" />

      {/* Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="theme-toggle-track">
          <span className={`theme-toggle-thumb${isDark ? " theme-toggle-thumb--dark" : ""}`}>
            {isDark ? <MoonIcon /> : <SunIcon />}
          </span>
        </span>
        <span className="theme-toggle-label">{isDark ? "Dark mode" : "Light mode"}</span>
      </button>

      {/* Footer */}
      <div className="navbar-footer">
        <div className="footer-status">
          <span className="footer-dot" />
          <span>API Connected</span>
        </div>
        <span className="footer-version">v2.1</span>
      </div>
    </nav>
  );
}