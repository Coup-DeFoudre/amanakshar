import type { Metadata, Viewport } from "next";
import { Noto_Serif_Devanagari, Tiro_Devanagari_Hindi, Hind } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/shared/Navigation";
import { NotificationPrompt } from "@/components/shared/NotificationPrompt";
import { SkipLinks } from "@/components/shared/SkipLinks";
import { WebsiteJsonLd, PoetJsonLd } from "@/components/seo";
import { OfflineBanner } from "@/components/poems/OfflineIndicator";
import { ToastProvider } from "@/components/shared/Toast";
import { NetworkStatus } from "@/components/shared/NetworkStatus";
import { NoScriptFallback } from "@/components/shared/NoScriptFallback";

// Poem body font - literary, serif
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-poem",
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'serif'],
});

// Titles and headings - classical, formal
const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'serif'],
});

// UI elements - clean, neutral
const hind = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "अमन अक्षर — कवि",
  description: "अमन अक्षर की कविताओं, मंचीय प्रस्तुतियों और पुस्तकों का स्थायी, भावनात्मक और गंभीर साहित्यिक घर।",
  keywords: ["अमन अक्षर", "कवि", "हिंदी कविता", "कवि सम्मेलन", "Hindi poetry", "Aman Akshar"],
  authors: [{ name: "अमन अक्षर" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "अमन अक्षर — कवि",
    description: "कविताओं, प्रस्तुतियों और पुस्तकों का साहित्यिक घर",
    locale: "hi_IN",
    type: "website",
  },
  other: {
    "google": "notranslate",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" translate="no" className="notranslate">
      <head>
        {/* DNS prefetch for faster external resource resolution */}
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://cdn.amanakshar.com" />
        
        {/* Preconnect for critical external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.amanakshar.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          href="/images/poet/signature.svg" 
          as="image" 
          type="image/svg+xml"
        />
      </head>
      <body
        className={`${notoSerifDevanagari.variable} ${tiroDevanagariHindi.variable} ${hind.variable} bg-bg-primary text-text-primary antialiased`}
      >
        {/* NoScript Fallback for JavaScript-disabled browsers */}
        <NoScriptFallback />
        
        {/* Toast Provider for notifications */}
        <ToastProvider>
          {/* Structured Data */}
          <WebsiteJsonLd />
          <PoetJsonLd imageUrl="/images/poet/aman-akshar-portrait.svg" />
          
          {/* Skip Links for Accessibility */}
          <SkipLinks />
          
          {/* Network Status Indicator */}
          <NetworkStatus />
          
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          
          {/* Overlays */}
          <OfflineBanner />
          <NotificationPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}
