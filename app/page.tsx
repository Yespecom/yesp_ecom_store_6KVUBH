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
      <div className="text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-12 h-12 border-3 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-12 h-12 border-2 border-primary/20 rounded-full animate-pulse mx-auto"></div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2 animate-slide-up">Earthy Aromas</h1>
        <p className="text-sm text-muted-foreground animate-slide-up" style={{ "--stagger": "1" } as any}>
          Loading your store...
        </p>
        <div className="mt-4 w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse"></div>
        </div>
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

        await new Promise((resolve) => setTimeout(resolve, 800))

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
      <div className="animate-fade-in">
        <Header />
      </div>
      <main className="animate-slide-up" style={{ "--stagger": "1" } as any}>
        <HeroSection />
        <div className="animate-slide-up" style={{ "--stagger": "2" } as any}>
          <FeaturedProducts preloadedProducts={appData.products} />
        </div>
        <div className="animate-slide-up" style={{ "--stagger": "3" } as any}>
          <Newsletter />
        </div>
      </main>
      <div className="animate-fade-in" style={{ "--stagger": "4" } as any}>
        <Footer />
      </div>
    </div>
  )
}
