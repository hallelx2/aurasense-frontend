import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurasense - Voice-First Lifestyle Companion",
  description: "Discover food, travel, and community through voice-first technology. Aurasense makes lifestyle choices accessible, safe, and personalized.",
  keywords: [
    "voice-first",
    "accessibility",
    "food discovery",
    "travel recommendations",
    "community",
    "health-aware",
    "lifestyle companion",
    "AI assistant"
  ],
  authors: [{ name: "Aurasense Team" }],
  creator: "Aurasense",
  publisher: "Aurasense",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aurasense.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aurasense.app",
    title: "Aurasense - Voice-First Lifestyle Companion",
    description: "Discover food, travel, and community through voice-first technology.",
    siteName: "Aurasense",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aurasense - Voice-First Lifestyle Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurasense - Voice-First Lifestyle Companion",
    description: "Discover food, travel, and community through voice-first technology.",
    creator: "@aurasense",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
