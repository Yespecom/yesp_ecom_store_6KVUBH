"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WishlistItem {
  productId: string
  name: string
  price: number
  thumbnail?: string
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse saved wishlist:", error)
        localStorage.removeItem("wishlist")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = async (productId: string) => {
    setIsLoading(true)
    try {
      const { fetchProduct } = await import("@/lib/api")
      const product = await fetchProduct(productId)

      if (!product) {
        throw new Error("Product not found")
      }

      setItems((prevItems) => {
        const exists = prevItems.some((wishlistItem) => wishlistItem.productId === productId)
        if (exists) return prevItems

        const newItem: WishlistItem = {
          productId,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          addedAt: new Date().toISOString(),
        }

        return [...prevItems, newItem]
      })
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const clearWishlist = () => {
    setItems([])
    localStorage.removeItem("wishlist")
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  const getItemCount = () => {
    return items.length
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getItemCount,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
