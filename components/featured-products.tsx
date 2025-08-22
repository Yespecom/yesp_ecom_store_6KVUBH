import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  isNew?: boolean
  isBestseller?: boolean
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Lavender Essential Oil",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder-41qsw.png",
    category: "Essential Oils",
    isBestseller: true,
  },
  {
    id: "2",
    name: "Rose Aromatherapy Candle",
    price: 799,
    rating: 4.6,
    reviews: 89,
    image: "/rose-aromatherapy-candle.png",
    category: "Candles",
    isNew: true,
  },
  {
    id: "3",
    name: "Eucalyptus Diffuser Oil",
    price: 699,
    originalPrice: 899,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder-htr3e.png",
    category: "Diffuser Oils",
  },
  {
    id: "4",
    name: "Aromatherapy Gift Set",
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 203,
    image: "/aromatherapy-gift-set.png",
    category: "Gift Sets",
    isBestseller: true,
  },
]

export function FeaturedProducts({ preloadedProducts }: { preloadedProducts?: any[] }) {
  // Use preloaded products if available, otherwise fall back to static data
  const products = preloadedProducts && preloadedProducts.length > 0 ? preloadedProducts.slice(0, 4) : featuredProducts

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular aromatherapy products, carefully selected for their quality and effectiveness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                    {product.isBestseller && <Badge className="bg-orange-500 text-white">Bestseller</Badge>}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/category/all">
            <Button
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
