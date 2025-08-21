"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { searchProducts, type Product } from "@/lib/api"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, isLoading: cartLoading } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query.trim()) {
        setLoading(false)
        return
      }

      try {
        const searchResults = await searchProducts(query)
        setProducts(searchResults)
      } catch (error) {
        console.error("Failed to load search results:", error)
        toast({
          title: "Error",
          description: "Failed to load search results. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSearchResults()
  }, [query, toast])

  const handleAddToCart = async (productId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    try {
      await addToCart(productId, 1)
      toast({
        title: "Success",
        description: "Product added to cart!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      })
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  const handleBackClick = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-8 w-64 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                        <div className="bg-gray-200 h-8 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-montserrat text-foreground">Search Results</h1>
              <p className="text-muted-foreground mt-2">
                {query ? `${products.length} results for "${query}"` : "Enter a search term to find products"}
              </p>
            </div>
          </div>

          {!query.trim() ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No search query</h2>
              <p className="text-muted-foreground mb-8">Please enter a search term to find products.</p>
              <Button onClick={handleBackClick}>Go Back</Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-foreground mb-4">No products found</h2>
              <p className="text-muted-foreground mb-8">
                We couldn't find any products matching "{query}". Try different keywords.
              </p>
              <Button onClick={handleBackClick}>Go Back</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-lg transition-all duration-300 border-border cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.thumbnail || "/placeholder.svg?height=256&width=256&query=product"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {index < 3 && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          {index === 0 ? "Best Match" : index === 1 ? "Popular" : "Relevant"}
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">(4.5)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.trackQuantity ? "In Stock" : product.stockStatus}
                        </span>
                      </div>

                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={(e) => handleAddToCart(product._id, e)}
                        disabled={cartLoading || !product.isActive}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {!product.isActive ? "Unavailable" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
