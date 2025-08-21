"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Heart, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react"
import { fetchProduct, type Product } from "@/lib/api"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imageLoading, setImageLoading] = useState(true)
  const { addToCart, isLoading: cartLoading } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.slug) return

      try {
        const fetchedProduct = await fetchProduct(params.slug as string)
        setProduct(fetchedProduct)
      } catch (error) {
        console.error("Failed to load product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.slug, toast])

  const handleAddToCart = async () => {
    if (!product) return

    try {
      await addToCart(product._id, quantity)
      toast({
        title: "Added to Cart",
        description: `${quantity} ${product.name} added to cart!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-24" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="relative">
                  <Skeleton className="w-full h-96 rounded-lg" />
                  <Skeleton className="absolute top-4 left-4 w-16 h-6 rounded-full" />
                  <Skeleton className="absolute top-4 right-4 w-10 h-10 rounded-full" />
                </div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Details Skeleton */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>

                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-32" />
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
        <Footer />
      </>
    )
  }

  const images = product.gallery.length > 0 ? product.gallery : [product.thumbnail]
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <LoadingSpinner size="md" />
                </div>
              )}
              <img
                src={images[selectedImage] || "/placeholder.svg?height=500&width=500&query=product"}
                alt={product.name}
                className={`w-full h-96 object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setImageLoading(false)}
              />
              {discount > 0 && <Badge className="absolute top-4 left-4 bg-red-500 text-white">{discount}% OFF</Badge>}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 bg-background/80 hover:bg-background transition-all duration-200 hover:scale-110"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setImageLoading(true)
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === index ? "border-primary shadow-md" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=80&width=80&query=product"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {product.trackQuantity ? "In Stock" : product.stockStatus} • SKU: {product.sku}
              </p>
              <p className="text-sm text-green-600">Free delivery</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">About this item</h3>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Qty:
                </label>
                <div className="flex items-center border rounded-md bg-background">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-center min-w-[2rem] text-sm">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3"
                onClick={handleAddToCart}
                disabled={cartLoading || !product.isActive}
                size="lg"
              >
                {cartLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {!product.isActive ? "Currently Unavailable" : "Add to Cart"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>FREE delivery by tomorrow</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure transaction</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                <span>Easy returns & exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
