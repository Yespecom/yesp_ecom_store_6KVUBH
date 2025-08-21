"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { searchProducts, type Product } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"

interface LiveSearchProps {
  onClose?: () => void
  className?: string
}

export function LiveSearch({ onClose, className }: LiveSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const popularSearches = [
    "Essential Oils",
    "Candles",
    "Aromatherapy",
    "Natural Soaps",
    "Diffusers",
    "Skincare",
    "Bath & Body",
    "Home Fragrance",
  ]

  const isMatchedByCategory = (product: Product, searchTerm: string) => {
    return product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  }

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchProducts(debouncedQuery)
        setResults(searchResults.slice(0, 6)) // Limit to 6 results for dropdown
      } catch (error) {
        console.error("Search failed:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    if (debouncedQuery) {
      performSearch()
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)

    if (value.trim().length >= 2) {
      setLoading(true)
    }
  }

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setQuery("")
      setIsOpen(false)
      onClose?.()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setQuery("")
    setIsOpen(false)
    onClose?.()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search products, categories..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-4 pr-20 py-2 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-gray-300 text-sm transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
        />

        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
          >
            <Search className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {loading && query.length >= 2 && (
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4 animate-spin" />
                  <span>Searching for "{query}"...</span>
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!loading && results.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                  Products ({results.length})
                </div>
                {results.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors duration-150 text-left rounded-md"
                  >
                    <img
                      src={product.thumbnail || "/placeholder.svg?height=48&width=48&query=product"}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{product.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-primary">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isMatchedByCategory(product, query)
                              ? "bg-primary/10 text-primary font-medium"
                              : "bg-gray-100 text-muted-foreground"
                          }`}
                        >
                          {product.category.name}
                        </span>
                        {isMatchedByCategory(product, query) && (
                          <span className="text-xs text-primary font-medium">Category match</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {results.length === 6 && (
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full p-3 text-center text-sm text-primary hover:bg-gray-50 transition-colors duration-150 border-t"
                  >
                    View all results for "{query}"
                  </button>
                )}
              </div>
            )}

            {/* No Results */}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No products found</p>
                <p className="text-xs text-muted-foreground">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Recent Searches & Popular Searches */}
            {!loading && query.length < 2 && (
              <div className="p-2 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </Button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 transition-colors duration-150 text-left rounded-md"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Popular Searches</div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 transition-colors duration-150 text-left rounded-md"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
