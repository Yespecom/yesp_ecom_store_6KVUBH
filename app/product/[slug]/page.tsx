"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { fetchProduct, type Product } from "@/lib/api"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const { addToCart, isLoading: cartLoading } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist()
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
        variant: "default",
      })
      setQuantity(1)
    } catch (error) {
      console.error("[v0] Failed to add product to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return

    try {
      const isCurrentlyInWishlist = isInWishlist(product._id)

      if (isCurrentlyInWishlist) {
        await removeFromWishlist(product._id)
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from wishlist.`,
          variant: "default",
        })
      } else {
        await addToWishlist(product._id)
        toast({
          title: "Added to Wishlist",
          description: `${product.name} added to wishlist!`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to update wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openImageModal = (index: number) => {
    setModalImageIndex(index)
    setIsModalOpen(true)
  }

  const closeImageModal = () => {
    setIsModalOpen(false)
  }

  const navigateModal = (direction: "prev" | "next") => {
    if (!product) return
    const images = product.gallery.length > 0 ? product.gallery : [product.thumbnail]

    if (direction === "prev") {
      setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    } else {
      setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return

      switch (e.key) {
        case "Escape":
          closeImageModal()
          break
        case "ArrowLeft":
          navigateModal("prev")
          break
        case "ArrowRight":
          navigateModal("next")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen])

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
  const isProductInWishlist = product ? isInWishlist(product._id) : false

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
            <div className="relative overflow-hidden rounded-lg border group">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                  <LoadingSpinner size="md" />
                </div>
              )}
              <div className="relative cursor-zoom-in" onClick={() => openImageModal(selectedImage)}>
                <img
                  src={images[selectedImage] || "/placeholder.svg?height=600&width=600&query=product"}
                  alt={product.name}
                  className={`w-full h-96 md:h-[500px] object-cover transition-all duration-300 hover:scale-105 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
                </div>
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1
                      setSelectedImage(newIndex)
                      setImageLoading(true)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-12 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      const newIndex = selectedImage === images.length - 1 ? 0 : selectedImage + 1
                      setSelectedImage(newIndex)
                      setImageLoading(true)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white z-20">{discount}% OFF</Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-4 right-4 bg-background/80 hover:bg-background transition-all duration-200 hover:scale-110 z-20 ${
                  isProductInWishlist ? "text-red-500" : "text-muted-foreground"
                }`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Heart className={`h-4 w-4 ${isProductInWishlist ? "fill-current" : ""}`} />
                )}
              </Button>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setImageLoading(true)
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      selectedImage === index
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
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

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">About this item</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
                {product.description && product.description !== product.shortDescription && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-foreground">Detailed Description</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Product Details</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">SKU:</span> {product.sku}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span> {product.category.name}
                    </p>
                    {product.weight > 0 && (
                      <p>
                        <span className="font-medium">Weight:</span> {product.weight}g
                      </p>
                    )}
                  </div>
                </div>
                {product.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 transition-all duration-200 hover:scale-105"
                onClick={handleAddToCart}
                disabled={cartLoading || !product.isActive}
                size="lg"
              >
                {cartLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {!product.isActive ? "Currently Unavailable" : cartLoading ? "Adding to Cart..." : "Add to Cart"}
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

      {/* Full-screen image modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeImageModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateModal("prev")}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={() => navigateModal("next")}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main modal image */}
            <img
              src={images[modalImageIndex] || "/placeholder.svg?height=800&width=800&query=product"}
              alt={`${product.name} ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={closeImageModal}
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
