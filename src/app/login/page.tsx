"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/public/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (signInError) {
      console.error("Login error:", signInError.message, signInError.status);
      setError(`Error: ${signInError.message}`);
      return;
    }

    if (!data.user) {
      setError("No se pudo obtener la información del usuario.");
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <Logo style={{ width: "48px", height: "48px" }} />
            <div style={{ textAlign: "left" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "#e8efe6",
                  fontWeight: 400,
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
                Panel de Administración
              </span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: "#111a16",
            border: "1px solid rgba(45, 106, 79, 0.2)",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              color: "#e8efe6",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontWeight: 400,
            }}
          >
            Iniciar Sesión
          </h2>

          {error && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "rgba(224, 122, 95, 0.1)",
                border: "1px solid #e07a5f",
                borderRadius: "8px",
                color: "#e07a5f",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#5a6e63",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#0a0f0d",
                  border: "1px solid rgba(45, 106, 79, 0.2)",
                  borderRadius: "8px",
                  color: "#e8efe6",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="tu@email.com"
                onFocus={(e) => (e.target.style.borderColor = "#40916c")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  color: "#5a6e63",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#0a0f0d",
                  border: "1px solid rgba(45, 106, 79, 0.2)",
                  borderRadius: "8px",
                  color: "#e8efe6",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                placeholder="••••••••"
                onFocus={(e) => (e.target.style.borderColor = "#40916c")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(45, 106, 79, 0.2)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: loading ? "#1a3a2a" : "#2d6a4f",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#40916c")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#2d6a4f")}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        {/* Back to public site */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/"
            style={{
              color: "#5a6e63",
              fontSize: "0.875rem",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#40916c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#5a6e63")}
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#5a6e63" }}>Cargando...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
