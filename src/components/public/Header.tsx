"use client";

import { Logo } from "./Logo";

const navLinks = [
  { href: "#performance", label: "Rendimiento" },
  { href: "#portfolio", label: "Portafolio" },
  { href: "#decisions", label: "Decisiones" },
  { href: "#methodology", label: "Metodología" },
];

export function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
        padding: "1.5rem 0",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10, 15, 13, 0.85)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Logo style={{ width: "36px", height: "36px" }} />
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.35rem",
                fontWeight: 400,
                letterSpacing: "0.02em",
                color: "#e8efe6",
              }}
            >
              Los Álamos Capital
            </h1>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#40916c",
              }}
            >
              Investment Track Record
            </span>
          </div>
        </div>
        <nav className="nav-responsive" style={{ display: "flex" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "#8a9e93",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginLeft: "2rem",
                transition: "color 0.3s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#52b788")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8a9e93")}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
