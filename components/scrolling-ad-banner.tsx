"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollingAdBanner() {
  const [isVisible, setIsVisible] = useState(true)

  const messages = [
    "🎉 Free shipping on orders over ₹999! Limited time offer",
    "✨ New arrivals: Premium natural products now available",
    "🌿 100% Natural ingredients - Shop with confidence",
    "💫 Subscribe to our newsletter and get 10% off your first order",
  ]

  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [messages.length])

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-sm font-medium animate-fade-in">{messages[currentMessage]}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
  )
}
