import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ScrollingAdBanner } from "@/components/scrolling-ad-banner"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
  preload: true,
})

export const metadata: Metadata = {
  title: "Earthy Aromas - Premium Natural Products",
  description: "Discover premium aromatic products crafted with natural ingredients",
  generator: "v0.app",
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>

        <h1 className="text-xl font-semibold text-foreground">Earthy Aromas</h1>
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
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollingAdBanner />
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
