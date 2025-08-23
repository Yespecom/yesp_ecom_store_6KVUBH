"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchProduct, type Cart, type CartItem } from "@/lib/api"

interface CartContextType {
  cart: Cart | null
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    console.log("[v0] Adding to cart:", { productId, quantity })
    setIsLoading(true)

    try {
      const product = await fetchProduct(productId)
      console.log("[v0] Product fetched for cart:", product)

      setCart((prevCart) => {
        if (!prevCart) {
          const newCart = {
            id: `local-${Date.now()}`,
            items: [
              {
                productId,
                name: product.name,
                price: product.price,
                quantity,
                subtotal: product.price * quantity,
                thumbnail: product.thumbnail,
                sku: product.sku,
              },
            ],
            total: product.price * quantity,
          }
          console.log("[v0] Created new cart:", newCart)
          return newCart
        }

        const existingItem = prevCart.items.find((item) => item.productId === productId)
        if (existingItem) {
          const updatedItems = prevCart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity, subtotal: item.price * (item.quantity + quantity) }
              : item,
          )
          const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
          const updatedCart = { ...prevCart, items: updatedItems, total }
          console.log("[v0] Updated existing item in cart:", updatedCart)
          return updatedCart
        } else {
          const newItem: CartItem = {
            productId,
            name: product.name,
            price: product.price,
            quantity,
            subtotal: product.price * quantity,
            thumbnail: product.thumbnail,
            sku: product.sku,
          }
          const updatedItems = [...prevCart.items, newItem]
          const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
          const updatedCart = { ...prevCart, items: updatedItems, total }
          console.log("[v0] Added new item to cart:", updatedCart)
          return updatedCart
        }
      })
    } catch (error) {
      console.error("[v0] Failed to add product to cart:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
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

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
