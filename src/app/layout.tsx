import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/nunito/800.css";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vedant Lad",
  description: "Design engineer crafting thoughtful digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="card-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
