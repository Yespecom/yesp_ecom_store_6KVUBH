"use client"

import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const heroSlides = [
  {
    id: 1,
    title: "Get up to 30% off",
    subtitle: "New Arrivals",
    description: "Shop the latest looks, wear your confidence.",
    buttonText: "SHOP NOW →",
    bgGradient: "from-teal-200 to-teal-300",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-18%20at%202.11.55%E2%80%AFPM-q7PLJ6v38m47yncZVO7CalYHmkPoCu.png",
    imageAlt: "Stylish man in coral blazer and sunglasses",
  },
  {
    id: 2,
    title: "Summer Collection",
    subtitle: "Up to 50% off",
    description: "Beat the heat with our cool summer styles.",
    buttonText: "EXPLORE →",
    bgGradient: "from-orange-200 to-orange-300",
    image: "/woman-summer-dress.png",
    imageAlt: "Woman in summer dress",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Luxury Fashion",
    description: "Elevate your wardrobe with premium pieces.",
    buttonText: "DISCOVER →",
    bgGradient: "from-purple-200 to-purple-300",
    image: "/elegant-fashion-model.png",
    imageAlt: "Elegant fashion model",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="bg-white py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div
          className={`bg-gradient-to-r ${currentSlideData.bgGradient} rounded-2xl md:rounded-3xl overflow-hidden relative`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[400px] md:min-h-[500px]">
            <div className="p-6 md:p-12 lg:p-16 space-y-6 md:space-y-8 order-2 lg:order-1">
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {currentSlideData.title}
                  <br />
                  <span className="text-gray-900">{currentSlideData.subtitle}</span>
                </h1>
                <p className="text-base md:text-lg text-gray-700 max-w-md">{currentSlideData.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto"
                >
                  {currentSlideData.buttonText}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-10 w-10 md:h-12 md:w-12 p-0 bg-white/20 hover:bg-white/30 rounded-full"
                >
                  <Play className="h-4 w-4 md:h-5 md:w-5 text-gray-900 ml-0.5" />
                </Button>
              </div>
            </div>

            <div className="relative h-64 md:h-full md:min-h-[500px] flex items-end justify-center order-1 lg:order-2">
              <img
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.imageAlt}
                className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500"
              />
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1.5 md:p-2 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1.5 md:p-2 transition-colors"
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-900" />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-gray-900" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
