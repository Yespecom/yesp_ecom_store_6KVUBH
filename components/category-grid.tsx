import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Electronics",
    image: "/modern-electronics-category.png",
    productCount: 156,
  },
  {
    name: "Fashion",
    image: "/fashion-clothing-category.png",
    productCount: 89,
  },
  {
    name: "Home & Garden",
    image: "/home-garden-decor.png",
    productCount: 234,
  },
  {
    name: "Sports & Fitness",
    image: "/sports-fitness-equipment.png",
    productCount: 67,
  },
  {
    name: "Books & Media",
    image: "/books-media-category.png",
    productCount: 123,
  },
  {
    name: "Beauty & Health",
    image: "/beauty-health-products.png",
    productCount: 98,
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-foreground mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of categories and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.productCount} products</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
