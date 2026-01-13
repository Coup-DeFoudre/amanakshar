import type { Metadata, Viewport } from "next";
import { Noto_Serif_Devanagari, Tiro_Devanagari_Hindi, Hind } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/shared/Navigation";
import { PaperTexture } from "@/components/background";

// Poem body font - literary, serif
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-poem",
  display: "swap",
});

// Titles and headings - classical, formal
const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-heading",
  display: "swap",
});

// UI elements - clean, neutral
const hind = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
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
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
    <html lang="hi">
      <body
        className={`${notoSerifDevanagari.variable} ${tiroDevanagariHindi.variable} ${hind.variable}`}
      >
        <PaperTexture />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
