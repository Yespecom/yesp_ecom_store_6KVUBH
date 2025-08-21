"use client"

import { useState, useEffect } from "react"

interface WishlistItem {
  productId: string
  name: string
  price: number
  thumbnail?: string
  addedAt: string
}

interface UseWishlistReturn {
  items: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, "addedAt">) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

export function useWishlist(): UseWishlistReturn {
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

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getItemCount,
  }
}
