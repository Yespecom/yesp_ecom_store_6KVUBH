"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { fetchProducts, fetchCategories } from "@/lib/api"

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-foreground">Earthy Aromas</h1>
        <p className="text-sm text-muted-foreground mt-2">Loading your store...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [appData, setAppData] = useState({
    products: [],
    categories: [],
  })

  useEffect(() => {
    const preloadData = async () => {
      try {
        console.log("[v0] Starting data preload...")

        // Fetch all necessary data in parallel
        const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])

        console.log("[v0] Data loaded:", { products: products.length, categories: categories.length })

        // Store the data
        setAppData({
          products,
          categories,
        })

        // Add minimum loading time for smooth UX
        await new Promise((resolve) => setTimeout(resolve, 1500))

        console.log("[v0] Loading complete, showing application")
        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Error preloading data:", error)
        // Still show the app even if data loading fails
        setIsLoading(false)
      }
    }

    preloadData()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts preloadedProducts={appData.products} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
