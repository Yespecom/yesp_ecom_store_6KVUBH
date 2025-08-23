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
  addToWishlist: (item: Omit<WishlistItem, "addedAt">) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
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

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (item: Omit<WishlistItem, "addedAt">) => {
    setItems((prevItems) => {
      const exists = prevItems.some((wishlistItem) => wishlistItem.productId === item.productId)
      if (exists) return prevItems

      return [...prevItems, { ...item, addedAt: new Date().toISOString() }]
    })
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
