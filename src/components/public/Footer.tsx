"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface FooterProps {
  lastUpdated?: string;
}

export function Footer({ lastUpdated }: FooterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = lastUpdated
    ? format(new Date(lastUpdated), "dd/MM/yyyy", { locale: es })
    : format(new Date(), "dd/MM/yyyy", { locale: es });

  return (
    <footer style={{ padding: "2rem 0", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <p style={{ fontSize: "0.75rem", color: "#5a6e63" }}>
          Los Álamos Capital ·{" "}
          <a
            href="https://losalamoscapital.com"
            style={{
              color: isHovered ? "#52b788" : "#40916c",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            losalamoscapital.com
          </a>
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "#5a6e63" }}>
          Última actualización: {formattedDate}
        </p>
      </div>
    </footer>
  );
}
