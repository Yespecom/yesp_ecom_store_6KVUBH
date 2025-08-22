import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ScrollingAdBanner } from "@/components/scrolling-ad-banner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

export const metadata: Metadata = {
  title: "Earthy Aromas - Premium Natural Products",
  description: "Discover premium aromatic products crafted with natural ingredients",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative mb-4">
          <div className="w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-10 h-10 border-2 border-primary/20 rounded-full animate-pulse mx-auto"></div>
        </div>
        <h1 className="text-xl font-semibold text-foreground animate-slide-up">Earthy Aromas</h1>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans custom-scrollbar">
        <div className="animate-fade-in">
          <ScrollingAdBanner />
        </div>
        <Suspense fallback={<LoadingScreen />}>
          <div className="animate-scale-in">{children}</div>
        </Suspense>
      </body>
    </html>
  )
}
