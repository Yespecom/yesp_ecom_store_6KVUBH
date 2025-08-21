"use client"

import type React from "react"
import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import type { Product } from "@/lib/api"
import Image from "next/image"

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product._id)
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleCardClick = () => {
    window.location.href = `/product/${product.slug}`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg?height=200&width=200",
      quantity: 1,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        productId: product._id,
        name: product.name,
        price: product.price,
        thumbnail: product.images[0] || "/placeholder.svg?height=200&width=200",
      })
    }
  }

  return (
    <div onClick={handleCardClick} className="product-card">
      <Image
        src={product.images[0] || "/placeholder.svg?height=200&width=200"}
        alt={product.name}
        width={200}
        height={200}
        onLoad={() => setIsImageLoading(false)}
        className={isImageLoading ? "opacity-0" : "opacity-100"}
      />
      {discountPercentage > 0 && (
        <Badge className="absolute top-2 left-2 bg-red-100 text-red-800">{discountPercentage}% OFF</Badge>
      )}
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      {product.rating && (
        <div className="flex items-center">
          <Star size={16} className="text-yellow-500" />
          <span className="ml-1 text-sm font-medium text-gray-900">{product.rating}</span>
        </div>
      )}
      <Button onClick={handleAddToCart} variant="default">
        <ShoppingCart size={16} className="mr-2" />
        Add to Cart
      </Button>
      <Button onClick={handleWishlistToggle} variant="default">
        {isWishlisted ? (
          <>
            <Heart size={16} className="mr-2 text-red-500" />
            Remove from Wishlist
          </>
        ) : (
          <>
            <Heart size={16} className="mr-2" />
            Add to Wishlist
          </>
        )}
      </Button>
    </div>
  )
}

export default ProductCard
