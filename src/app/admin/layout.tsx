"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Logo } from "@/components/public/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0a0f0d",
      }}
    >
      <Sidebar
        onSignOut={handleSignOut}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile header for admin */}
        <div
          className="admin-mobile-header"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            background: "#111a16",
            borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "#e8efe6",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Logo style={{ width: "24px", height: "24px" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#e8efe6" }}>
              Los Álamos
            </span>
          </div>
          <div style={{ width: "44px" }} />
        </div>

        <main
          className="admin-main"
          style={{
            flex: 1,
            padding: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
