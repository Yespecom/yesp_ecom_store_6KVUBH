"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductSkeleton } from "@/components/product-skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { fetchProducts, type Product } from "@/lib/api"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface FeaturedProductsProps {
  preloadedProducts?: Product[]
}

export function FeaturedProducts({ preloadedProducts }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let fetchedProducts: Product[]
        if (preloadedProducts && preloadedProducts.length > 0) {
          fetchedProducts = preloadedProducts
        } else {
          fetchedProducts = await fetchProducts()
        }

        setProducts(fetchedProducts.slice(0, 20))
        setDisplayedProducts(fetchedProducts.slice(0, 3))
      } catch (error) {
        console.error("Failed to load products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [toast, preloadedProducts]) // Added preloadedProducts to dependency array

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || displayedProducts.length >= products.length) return

    setLoadingMore(true)
    setTimeout(() => {
      const currentCount = displayedProducts.length
      const nextBatch = products.slice(currentCount, currentCount + 3)
      setDisplayedProducts((prev) => [...prev, ...nextBatch])
      setLoadingMore(false)
    }, 800)
  }, [loadingMore, displayedProducts.length, products])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loadingMore && displayedProducts.length < products.length) {
          loadMoreProducts()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreProducts, loadingMore, displayedProducts.length, products.length])

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

  const handleProductClick = (productSlug: string) => {
    router.push(`/product/${productSlug}`)
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-foreground mb-4">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our premium collection of aromatic products crafted with natural ingredients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <ProductSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-foreground mb-4">Our Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of aromatic products crafted with natural ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product, index) => (
            <Card
              key={product._id}
              className="group hover:shadow-lg transition-all duration-300 border-border cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4 duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleProductClick(product.slug)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.thumbnail || "/placeholder.svg?height=256&width=256&query=product"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground animate-in slide-in-from-left-2 duration-300">
                    {index === 0 ? "Best Seller" : index === 1 ? "New" : index === 2 ? "Sale" : "Popular"}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-background/80 hover:bg-background transition-all duration-200 hover:scale-110"
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
                            className={`h-3 w-3 transition-colors duration-200 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
                    onClick={(e) => handleAddToCart(product._id, e)}
                    disabled={!product.isActive}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {!product.isActive ? "Unavailable" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {loadingMore && [...Array(3)].map((_, i) => <ProductSkeleton key={`loading-${i}`} index={i} />)}
        </div>

        {displayedProducts.length < products.length && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
            {loadingMore && (
              <div className="flex items-center text-muted-foreground">
                <LoadingSpinner size="sm" className="mr-2" />
                Loading more products...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
