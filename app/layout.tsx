import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Calculator & Unit Converter',
  description: 'High-Precision Scientific Calculator & 14+ Unit Converter Web Application.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Smart Calc',
  },
};

export const viewport: Viewport = {
  themeColor: '#09152B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased min-h-screen text-[#0A1128] dark:text-white transition-colors duration-300">
        {/* Quest Ambient Energy Overlay */}
        <div className="quest-ambient-bg" aria-hidden="true" />
        {/* Quest Subtle Fractal Noise Texture */}
        <div className="quest-noise-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
