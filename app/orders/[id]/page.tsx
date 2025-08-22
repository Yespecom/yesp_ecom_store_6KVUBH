"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { ArrowLeft, Package, MapPin, Truck, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthDialog } from "@/components/auth-dialog"

interface OrderDetails {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  total: number
  subtotal: number
  tax: number
  shipping: number
  itemCount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    subtotal: number
  }>
  shippingAddress: {
    fullName: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  estimatedDelivery?: string
  trackingNumber?: string
  orderTimeline: Array<{
    status: string
    date: string
    description: string
  }>
}

// Mock order details - in a real app, this would come from an API
const mockOrderDetails: OrderDetails = {
  id: "1",
  orderNumber: "ORD-2024-001",
  date: "2024-01-15",
  status: "delivered",
  total: 2499,
  subtotal: 2118,
  tax: 381,
  shipping: 0,
  itemCount: 3,
  items: [
    { id: "1", name: "Lavender Essential Oil", quantity: 1, price: 899, subtotal: 899 },
    { id: "2", name: "Rose Aromatherapy Candle", quantity: 2, price: 800, subtotal: 1600 },
  ],
  shippingAddress: {
    fullName: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
  paymentMethod: "Online Payment - UPI",
  estimatedDelivery: "2024-01-20",
  trackingNumber: "TRK123456789",
  orderTimeline: [
    {
      status: "delivered",
      date: "2024-01-19",
      description: "Order delivered successfully",
    },
    {
      status: "shipped",
      date: "2024-01-17",
      description: "Order shipped from warehouse",
    },
    {
      status: "confirmed",
      date: "2024-01-16",
      description: "Order confirmed and being prepared",
    },
    {
      status: "pending",
      date: "2024-01-15",
      description: "Order placed successfully",
    },
  ],
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <Package className="h-4 w-4" />
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-600"
    case "confirmed":
      return "text-blue-600"
    case "shipped":
      return "text-purple-600"
    case "delivered":
      return "text-green-600"
    case "cancelled":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      if (params.id === "1") {
        setOrder(mockOrderDetails)
      }
      setIsLoading(false)
    }, 1000)
  }, [params.id, isAuthenticated])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/orders"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </div>

          <div className="max-w-md mx-auto text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-500 mb-8">Please login to view order details</p>
            <AuthDialog />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-10">
            <Link
              href="/orders"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/orders"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </div>

          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order not found</h2>
            <p className="text-gray-500 mb-8">
              The order you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link href="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-10">
          <Link
            href="/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-4xl font-bold font-montserrat text-gray-900">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Header */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{order.orderNumber}</CardTitle>
                    <p className="text-gray-500 flex items-center mt-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ordered on{" "}
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} bg-transparent border-0 text-lg px-4 py-2`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize font-semibold ml-2">{order.status}</span>
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Items ({order.itemCount})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-bold text-xl text-gray-900">₹{item.subtotal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <p className="font-semibold text-lg">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.email}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Timeline */}
          <div className="lg:col-span-1 space-y-8">
            {/* Order Summary */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{order.tax}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number</span>
                      <span className="font-medium">{order.trackingNumber}</span>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery</span>
                      <span className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderTimeline.map((timeline, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`${getStatusColor(timeline.status)} mt-1`}>{getStatusIcon(timeline.status)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{timeline.status}</p>
                        <p className="text-sm text-gray-600">{timeline.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(timeline.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
