"use client"

import { useState, useEffect } from "react"
import { addToCart as apiAddToCart, type Cart, type CartItem } from "@/lib/api"

interface UseCartReturn {
  cart: Cart | null
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse saved cart:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      // Try API first
      const apiCart = await apiAddToCart(productId, quantity)
      if (apiCart) {
        setCart(apiCart)
        return
      }
    } catch (error) {
      console.warn("API add to cart failed, using local cart:", error)
    }

    // Fallback to local cart management
    setCart((prevCart) => {
      if (!prevCart) {
        return {
          id: `local-${Date.now()}`,
          items: [
            {
              productId,
              name: `Product ${productId}`,
              price: 0, // Will be updated when product details are fetched
              quantity,
              subtotal: 0,
            },
          ],
          total: 0,
        }
      }

      const existingItem = prevCart.items.find((item) => item.productId === productId)
      if (existingItem) {
        const updatedItems = prevCart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, subtotal: item.price * (item.quantity + quantity) }
            : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        return { ...prevCart, items: updatedItems, total }
      } else {
        const newItem: CartItem = {
          productId,
          name: `Product ${productId}`,
          price: 0,
          quantity,
          subtotal: 0,
        }
        const updatedItems = [...prevCart.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        return { ...prevCart, items: updatedItems, total }
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      if (!prevCart) return null

      const updatedItems = prevCart.items.filter((item) => item.productId !== productId)
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)

      if (updatedItems.length === 0) {
        localStorage.removeItem("cart")
        return null
      }

      return { ...prevCart, items: updatedItems, total }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      if (!prevCart) return null

      const updatedItems = prevCart.items.map((item) =>
        item.productId === productId ? { ...item, quantity, subtotal: item.price * quantity } : item,
      )
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
      return { ...prevCart, items: updatedItems, total }
    })
  }

  const clearCart = () => {
    setCart(null)
    localStorage.removeItem("cart")
  }

  const getTotal = () => {
    return cart?.total || 0
  }

  const getItemCount = () => {
    return cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  }
}
