import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Weather Proofed",
    template: "%s | Weather Proofed"
  },
  description: "Build and maintain a resilient, weather-proofed investment portfolio with our expert guidance and advanced analytics. Make informed decisions for long-term financial success.",
  keywords: [
    "portfolio management",
    "investment strategy",
    "financial planning",
    "risk management",
    "wealth building",
    "market analysis",
    "investment tools",
    "portfolio diversification"
  ],
  authors: [{ name: "Weather Proofed Team" }],
  creator: "Weather Proofed",
  publisher: "Weather Proofed",
  openGraph: {
    type: "website",
    title: "Weather Proofed",
    description: "Build and maintain a resilient, weather-proofed investment portfolio with our expert guidance.",
    siteName: "Weather Proofed",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Weather Proofed - Portfolio Management"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Proofed",
    description: "Build and maintain a resilient, weather-proofed investment portfolio",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5" // You can adjust this color to match your brand
      }
    ]
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
