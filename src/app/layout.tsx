import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Los Álamos Capital — Historial de Inversiones",
    template: "%s | Los Álamos Capital",
  },
  description:
    "Historial público de inversiones de Los Álamos SpA. Transparencia total en gestión de inversiones familiares. Rendimiento, portafolio y decisiones de inversión.",
  keywords: [
    "inversiones",
    "historial de inversiones",
    "transparencia",
    "Los Álamos",
    "Chile",
    "family office",
    "gestión de inversiones",
    "rendimiento financiero",
    "portafolio de inversiones",
  ],
  authors: [{ name: "Los Álamos SpA" }],
  creator: "Los Álamos SpA",
  publisher: "Los Álamos SpA",
  metadataBase: new URL("https://losalamoscapital.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Los Álamos Capital — Historial de Inversiones",
    description:
      "Historial público de inversiones con transparencia absoluta. Donde hay álamos, hay raíces.",
    url: "https://losalamoscapital.com",
    siteName: "Los Álamos Capital",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Los Álamos Capital - Historial Público de Inversiones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Álamos Capital — Historial de Inversiones",
    description:
      "Historial público de inversiones con transparencia absoluta. Donde hay álamos, hay raíces.",
    images: ["/twitter-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
