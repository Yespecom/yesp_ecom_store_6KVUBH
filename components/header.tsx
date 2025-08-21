"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, LogOut, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthDialog } from "@/components/auth-dialog"
import { CartSidebar } from "@/components/cart-sidebar"
import { WishlistSidebar } from "@/components/wishlist-sidebar"
import { LiveSearch } from "@/components/live-search"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/hooks/use-auth"
import { fetchCategories, type Category } from "@/lib/api"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { getItemCount } = useCart()
  const { getItemCount: getWishlistCount } = useWishlist()
  const { user, logout, isAuthenticated } = useAuth()
  const cartCount = getItemCount()
  const wishlistCount = getWishlistCount()
  const pathname = usePathname()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories.filter((cat) => cat.isActive))
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [])

  const handleLogout = () => {
    logout()
  }

  const handleCartClick = () => {
    setIsCartOpen(true)
    setIsWishlistOpen(false)
  }

  const handleWishlistClick = () => {
    setIsWishlistOpen(true)
    setIsCartOpen(false)
  }

  const handleCloseSidebars = () => {
    setIsCartOpen(false)
    setIsWishlistOpen(false)
  }

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    setIsMenuOpen(false)
  }

  const handleNavigation = (href: string) => {
    window.location.href = href
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavigation("/")}
              className="transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <h1 className="text-lg md:text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
                Earthy Aromas
              </h1>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <LiveSearch />
            </div>

            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 lg:hidden transition-all duration-200 hover:scale-110"
                onClick={toggleMobileSearch}
              >
                <Search className="h-4 w-4 text-gray-600" />
              </Button>

              {isAuthenticated() ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 md:h-10 md:w-10 p-0 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <User className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2 duration-200">
                    <DropdownMenuItem className="transition-colors duration-150 hover:bg-gray-50">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="transition-colors duration-150 hover:bg-gray-50">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex">
                  <AuthDialog />
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 md:h-10 md:w-10 p-0 bg-pink-100 hover:bg-pink-200 rounded-lg relative transition-all duration-200 hover:scale-110"
                onClick={handleWishlistClick}
              >
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-pink-600" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-xs bg-pink-500 animate-pulse">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 md:h-10 md:w-10 p-0 bg-gray-900 hover:bg-gray-800 rounded-lg relative transition-all duration-200 hover:scale-110"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-white" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-xs bg-red-500 animate-pulse">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 md:hidden transition-all duration-200 hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <LiveSearch onClose={() => setShowMobileSearch(false)} />
            </div>
          )}

          <nav className="hidden md:flex items-center justify-center space-x-6 lg:space-x-12 py-3 md:py-4 border-t border-gray-100">
            <div
              onClick={() => {
                handleNavigation("/")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              Home
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-1 transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300">
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="animate-in slide-in-from-top-2 duration-200 w-48">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category._id}
                    onClick={() => {
                      handleNavigation(`/category/${category.slug}`)
                      setIsMenuOpen(false)
                    }}
                    className="transition-colors duration-150 hover:bg-gray-50 capitalize cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              onClick={() => {
                handleNavigation("/shop")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/shop"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              Shop
            </div>

            <div
              onClick={() => {
                handleNavigation("/deals")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/deals"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              Deals
            </div>

            <div
              onClick={() => {
                handleNavigation("/blog")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/blog"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              Blog
            </div>

            <div
              onClick={() => {
                handleNavigation("/about")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/about"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              About
            </div>
            <div
              onClick={() => {
                handleNavigation("/contact")
                setIsMenuOpen(false)
              }}
              className={`transition-all duration-300 font-medium border-b-2 pb-1 text-sm lg:text-base hover:scale-105 cursor-pointer ${
                pathname === "/contact"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
              }`}
            >
              Contact
            </div>
          </nav>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100">
                  {isAuthenticated() ? (
                    <>
                      <div className="flex items-center space-x-3 py-2">
                        <User className="h-5 w-5" />
                        <span className="text-base font-medium">{user?.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start py-3 transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02]"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="py-2">
                      <AuthDialog />
                    </div>
                  )}
                </div>

                <nav className="flex flex-col space-y-1 pt-2 border-t border-gray-100">
                  <div
                    onClick={() => {
                      handleNavigation("/")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 font-medium text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Home
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => {
                        handleNavigation(`/category/${category.slug}`)
                        setIsMenuOpen(false)
                      }}
                      className={`transition-all duration-200 py-3 text-base capitalize hover:scale-[1.02] rounded-lg cursor-pointer ${
                        pathname === `/category/${category.slug}`
                          ? "text-gray-900 bg-gray-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                    </div>
                  ))}

                  <div
                    onClick={() => {
                      handleNavigation("/shop")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/shop"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Shop All
                  </div>
                  <div
                    onClick={() => {
                      handleNavigation("/deals")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/deals"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Special Deals
                  </div>
                  <div
                    onClick={() => {
                      handleNavigation("/blog")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/blog"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Blog & Tips
                  </div>
                  <div
                    onClick={() => {
                      handleNavigation("/about")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/about"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    About Us
                  </div>
                  <div
                    onClick={() => {
                      handleNavigation("/contact")
                      setIsMenuOpen(false)
                    }}
                    className={`transition-all duration-200 py-3 text-base hover:scale-[1.02] rounded-lg cursor-pointer ${
                      pathname === "/contact"
                        ? "text-gray-900 bg-gray-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Contact Us
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={handleCloseSidebars} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={handleCloseSidebars} />
    </>
  )
}
