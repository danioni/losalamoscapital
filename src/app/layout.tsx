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
  title: "Los Álamos Capital — Track Record",
  description:
    "Track record público de inversiones de Los Álamos SpA. Transparencia total en gestión de inversiones familiares.",
  keywords: [
    "inversiones",
    "track record",
    "transparencia",
    "Los Álamos",
    "Chile",
  ],
  authors: [{ name: "Los Álamos SpA" }],
  openGraph: {
    title: "Los Álamos Capital — Track Record",
    description:
      "Track record público de inversiones con transparencia absoluta.",
    url: "https://losalamoscapital.com",
    siteName: "Los Álamos Capital",
    locale: "es_CL",
    type: "website",
  },
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
