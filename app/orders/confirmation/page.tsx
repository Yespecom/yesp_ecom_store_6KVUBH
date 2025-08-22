"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails] = useState({
    id: orderId || "ORD-" + Date.now(),
    status: "confirmed",
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Details Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-montserrat text-gray-900">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Order ID</span>
                <span className="font-semibold text-gray-900">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-green-600 capitalize">{orderDetails.status}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-semibold text-gray-900">{orderDetails.estimatedDelivery}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Package className="h-5 w-5 mr-2" />
                View My Orders
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="px-8 py-3 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Home className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>You'll receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>We'll notify you when your order is shipped</span>
              </div>
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Track your order status in "My Orders" section</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
