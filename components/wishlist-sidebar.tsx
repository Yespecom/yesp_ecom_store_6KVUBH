"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X, ShoppingBag, Trash2 } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"

interface WishlistSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { items, removeFromWishlist, clearWishlist, getItemCount } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = async (item: any) => {
    await addToCart(item.productId, 1)
    removeFromWishlist(item.productId)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <h2 className="text-xl font-bold">Wishlist</h2>
              <Badge variant="secondary" className="text-sm">
                {getItemCount()} {getItemCount() === 1 ? "item" : "items"}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Save items you love for later</p>
              <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wishlist Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.productId} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="h-6 w-6 text-pink-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.price}</p>

                          <div className="flex items-center justify-between mt-3 space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary hover:bg-primary/90"
                              onClick={() => handleAddToCart(item)}
                            >
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromWishlist(item.productId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Clear Wishlist */}
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
                onClick={clearWishlist}
              >
                Clear Wishlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
