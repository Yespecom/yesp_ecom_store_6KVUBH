const API_BASE_URL = "https://api.yespstudio.com/api/6KVUBH"

// Types
export interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  shortDescription: string
  description: string
  category: {
    _id: string
    name: string
    slug: string
  }
  tags: string[]
  trackQuantity: boolean
  price: number
  originalPrice: number
  taxPercentage: number
  lowStockAlert: number
  allowBackorders: boolean
  thumbnail: string
  gallery: string[]
  weight: number
  dimensions: {
    length: number | null
    width: number | null
    height: number | null
  }
  metaTitle: string
  metaDescription: string
  offer: any
  hasVariants: boolean
  variants: any[]
  isActive: boolean
  viewCount: number
  salesCount: number
  stockStatus: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  token: string
}

export interface Category {
  _id: string
  name: string
  description: string
  image: string
  parentCategory: string | null
  sortOrder: number
  isActive: boolean
  seo: {
    keywords: string[]
  }
  createdAt: string
  updatedAt: string
  slug: string
  __v: number
}

// API Functions
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // API returns products in data.products array
    if (data.products && Array.isArray(data.products)) {
      return data.products
    }

    console.warn("API returned no products or unexpected format:", data)
    return []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function fetchProduct(productId: string): Promise<Product | null> {
  try {
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.product) {
          return data.product
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      console.warn(`Failed to fetch products: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (data.products && Array.isArray(data.products)) {
      // Find exact match by slug first
      const exactMatch = data.products.find((p: Product) => p.slug === productId)
      if (exactMatch) {
        return exactMatch
      }

      // If no exact slug match, try matching by name converted to slug format
      const nameMatch = data.products.find((p: Product) => p.name.toLowerCase().replace(/\s+/g, "-") === productId)
      if (nameMatch) {
        return nameMatch
      }
    }

    console.warn(`Product not found: ${productId}`)
    return null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function addToCart(productId: string, quantity = 1): Promise<Cart | null> {
  try {
    const token = localStorage.getItem("auth_token")
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ productId, quantity }),
    })

    const data = await response.json()

    if (data.success && data.cart) {
      return data.cart
    }

    // If API fails, create a local cart fallback
    console.warn("API cart failed, using local cart:", data.message)

    // Fetch product details to create local cart item
    const product = await fetchProduct(productId)
    if (!product) {
      throw new Error("Product not found")
    }

    // Create a local cart structure
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    }

    const localCart: Cart = {
      id: `local-${Date.now()}`,
      items: [cartItem],
      total: cartItem.subtotal,
    }

    return localCart
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error // Re-throw to let the cart hook handle it properly
  }
}

export async function register(userData: {
  name: string
  email: string
  password: string
  phone?: string
  recaptchaToken?: string
}): Promise<AuthResponse | null> {
  try {
    console.log("[v0] Registration attempt with data:", {
      ...userData,
      password: "[REDACTED]",
      recaptchaToken: userData.recaptchaToken ? "[TOKEN]" : "none",
    })

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    console.log("[v0] Registration response status:", response.status)

    const data = await response.json()
    console.log("[v0] Registration response data:", data)

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    if (data.success) {
      localStorage.setItem("auth_token", data.token)
      return data
    }

    // If success is false, throw the specific error message
    throw new Error(data.message || "Registration failed")
  } catch (error) {
    console.error("Error registering:", error)
    throw error // Re-throw the error instead of returning null
  }
}

export async function login(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    if (data.success) {
      localStorage.setItem("auth_token", data.token)
      return data
    }

    // If success is false, throw the specific error message
    throw new Error(data.message || "Login failed")
  } catch (error) {
    console.error("Error logging in:", error)
    throw error // Re-throw the error instead of returning null
  }
}

export async function createOrder(cartId: string, addressId: string, paymentMethod = "online") {
  try {
    const token = localStorage.getItem("auth_token")
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartId, addressId, paymentMethod }),
    })

    const data = await response.json()

    if (data.success) {
      return data.order
    }
    throw new Error(data.message || "Failed to create order")
  } catch (error) {
    console.error("Error creating order:", error)
    return null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // API returns categories in data.categories array
    if (data.categories && Array.isArray(data.categories)) {
      return data.categories
    }

    console.warn("API returned no categories or unexpected format:", data)
    return []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // API returns products in data.products array
    if (data.products && Array.isArray(data.products)) {
      const filteredProducts = data.products.filter((product: Product) => {
        const searchTerm = query.toLowerCase()
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.shortDescription.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.name.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm)
        )
      })
      return filteredProducts
    }

    console.warn("API returned no search results or unexpected format:", data)
    return []
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

export async function fetchProductsByCategory(categoryId: string, limit = 50): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // API returns products in data.products array
    if (data.products && Array.isArray(data.products)) {
      return data.products
    }

    console.warn("API returned no category products or unexpected format:", data)
    return []
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}
