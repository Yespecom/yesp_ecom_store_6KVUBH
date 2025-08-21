"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { AuthDialog } from "@/components/auth-dialog"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const [promoCode, setPromoCode] = useState("")

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      alert("Please login to proceed with checkout")
      return
    }
    onClose()
    // TODO: Implement checkout flow
    alert("Checkout functionality coming soon!")
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <Badge variant="secondary" className="text-sm">
                {getItemCount()} {getItemCount() === 1 ? "item" : "items"}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some items to get started</p>
              <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <Card key={item.productId} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.price}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">₹{item.subtotal}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{getTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{Math.round(getTotal() * 0.18)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{Math.round(getTotal() * 1.18)}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                        size="sm"
                      />
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>

                    {isAuthenticated() ? (
                      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleCheckout}>
                        Checkout
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground text-center">Please login to checkout</p>
                        <AuthDialog />
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
