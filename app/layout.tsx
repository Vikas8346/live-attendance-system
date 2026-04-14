import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Attendance System",
  description: "QR Code Based Attendance Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', (e) => {
                if (e.message?.includes('MetaMask') || e.filename?.includes('inpage.js')) {
                  e.preventDefault();
                }
              });
              window.addEventListener('unhandledrejection', (e) => {
                const msg = e.reason?.toString?.() || '';
                if (msg.includes('MetaMask') || msg.includes('extension not found')) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
