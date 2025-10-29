import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { PerformanceMonitor } from "@/components/performance/performance-monitor";
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider";
import messages from "@/i18n/messages/en.json";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "NekoStack - SaaS Suite for Productivity",
  description: "A comprehensive SaaS suite providing essential tools for productivity and creativity. Image compression, QR generation, markdown editing, and more.",
  keywords: ["SaaS", "productivity", "tools", "image compression", "QR generator", "markdown editor"],
  authors: [{ name: "NekoStack Team" }],
  creator: "NekoStack",
  publisher: "NekoStack",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nekostack.com",
    siteName: "NekoStack",
    title: "NekoStack - SaaS Suite for Productivity",
    description: "A comprehensive SaaS suite providing essential tools for productivity and creativity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NekoStack - SaaS Suite for Productivity",
    description: "A comprehensive SaaS suite providing essential tools for productivity and creativity.",
    creator: "@nekostack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers locale="en" messages={messages}>
          <AnalyticsProvider>
            <OnboardingProvider>
              <PerformanceMonitor />
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </OnboardingProvider>
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  );
}