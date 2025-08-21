"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Sparkles, Minus, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AuthDialog } from "@/components/auth-dialog"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const [promoCode, setPromoCode] = useState("")
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId))
    setTimeout(() => {
      removeFromCart(productId)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      alert("Please login to proceed with checkout")
      return
    }
    // TODO: Implement checkout flow
    alert("Checkout functionality coming soon!")
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-md mx-auto">
              Discover amazing products and start your shopping journey with us
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold font-montserrat text-gray-900">Shopping Cart</h1>
          </div>
          <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-xl">
            {getItemCount()} {getItemCount() === 1 ? "item" : "items"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <Card
                key={item.productId}
                className={`border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${
                  removingItems.has(item.productId) ? "opacity-50 scale-95" : ""
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                      <ShoppingBag className="h-10 w-10 text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.productId}</p>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">per item</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-l-xl hover:bg-gray-200 transition-all duration-200"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, Number.parseInt(e.target.value) || 1)}
                          className="w-20 h-10 text-center border-0 focus:ring-0 bg-transparent font-semibold"
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-r-xl hover:bg-gray-200 transition-all duration-200"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-2xl text-gray-900">₹{item.subtotal}</p>
                        <p className="text-xs text-gray-500">subtotal</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 h-10 w-10"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl px-6 py-3 transition-all duration-200 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-xl px-6 py-3 hover:bg-gray-50 transition-all duration-200 bg-transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-montserrat text-gray-900 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-yellow-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal ({getItemCount()} items)</span>
                    <span className="font-semibold text-gray-900">₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">₹{Math.round(getTotal() * 0.18)}</span>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{Math.round(getTotal() * 1.18)}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 border-gray-200 focus:border-gray-400 rounded-xl bg-white/80 backdrop-blur-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 hover:bg-gray-50 px-6 transition-all duration-200 bg-transparent"
                    >
                      Apply
                    </Button>
                  </div>

                  {isAuthenticated() ? (
                    <Button
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-lg font-semibold"
                      onClick={handleCheckout}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 text-center">Please login to checkout</p>
                      <AuthDialog />
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500 space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p>Free shipping on orders over ₹500</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p>30-day return policy</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p>Secure payment processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
