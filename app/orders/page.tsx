"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Eye,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthDialog } from "@/components/auth-dialog"

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  total: number
  itemCount: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  estimatedDelivery?: string
}

// Mock orders data - in a real app, this would come from an API
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 2499,
    itemCount: 3,
    items: [
      { id: "1", name: "Lavender Essential Oil", quantity: 1, price: 899 },
      { id: "2", name: "Rose Aromatherapy Candle", quantity: 2, price: 800 },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "Online Payment",
    estimatedDelivery: "2024-01-20",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 1599,
    itemCount: 2,
    items: [
      { id: "3", name: "Eucalyptus Diffuser Oil", quantity: 1, price: 699 },
      { id: "4", name: "Sandalwood Incense Sticks", quantity: 1, price: 900 },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "Cash on Delivery",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-01-22",
    status: "confirmed",
    total: 3299,
    itemCount: 4,
    items: [
      { id: "5", name: "Aromatherapy Gift Set", quantity: 1, price: 1999 },
      { id: "6", name: "Peppermint Essential Oil", quantity: 2, price: 650 },
    ],
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    paymentMethod: "Online Payment",
    estimatedDelivery: "2024-01-28",
  },
]

const getStatusIcon = (status: Order["status"]) => {
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

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated()) {
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders)
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="max-w-md mx-auto text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-500 mb-8">Please login to view your orders</p>
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
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold font-montserrat text-gray-900">My Orders</h1>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-10">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold font-montserrat text-gray-900">My Orders</h1>
          </div>

          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Package className="h-5 w-5 mr-2" />
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
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold font-montserrat text-gray-900">My Orders</h1>
          </div>
          <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-xl">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Badge>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{order.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ordered on{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} border flex items-center space-x-1 px-3 py-1`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize font-medium">{order.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Items ({order.itemCount})</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      Payment Method
                    </h4>
                    <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    {order.estimatedDelivery && (
                      <>
                        <h4 className="font-semibold text-gray-900 flex items-center mt-4">
                          <Truck className="h-4 w-4 mr-2 text-gray-500" />
                          Estimated Delivery
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Order Total</h4>
                    <p className="text-2xl font-bold text-gray-900">₹{order.total}</p>
                    <div className="flex space-x-2 mt-4">
                      <Link href={`/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination would go here in a real app */}
        <div className="text-center mt-12">
          <p className="text-gray-500">Showing all orders</p>
        </div>
      </div>
    </div>
  )
}
