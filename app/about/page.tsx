"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Globe, Heart, ArrowRight, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState<number[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Animate sections in sequence
      const animateSection = (index: number) => {
        setTimeout(() => {
          setVisibleSections((prev) => [...prev, index])
        }, index * 200)
      }

      for (let i = 0; i < 6; i++) {
        animateSection(i)
      }
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">Loading our story...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Award, label: "Years of Excellence", value: "15+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Heart, label: "Products Loved", value: "10,000+" },
  ]

  const values = [
    {
      title: "Quality First",
      description: "We source only the finest products that meet our rigorous quality standards.",
      icon: CheckCircle,
    },
    {
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We're here to serve you with excellence.",
      icon: Heart,
    },
    {
      title: "Innovation Driven",
      description: "We continuously evolve to bring you the latest and greatest products.",
      icon: Award,
    },
    {
      title: "Global Reach",
      description: "Connecting customers worldwide with premium products and experiences.",
      icon: Globe,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section
          className={`text-center space-y-6 transition-all duration-1000 ${
            visibleSections.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Badge variant="secondary" className="px-4 py-2">
            About Earthy Aromas
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Our Story of
            <span className="text-primary block">Excellence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded with a passion for bringing you the finest products, Earthy Aromas has been your trusted companion
            in discovering premium quality items that enhance your lifestyle.
          </p>
        </section>

        {/* Stats Section */}
        <section
          className={`transition-all duration-1000 delay-200 ${
            visibleSections.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="space-y-4">
                  <stat.icon className="h-8 w-8 text-primary mx-auto" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 delay-400 ${
            visibleSections.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Earthy Aromas, we believe that everyone deserves access to premium quality products that bring joy and
              enhance their daily lives. Our mission is to curate and deliver exceptional items while providing an
              unmatched shopping experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're committed to sustainability, ethical sourcing, and building lasting relationships with our customers
              and partners around the world.
            </p>
            <Button className="group">
              Learn More About Our Values
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Heart className="h-16 w-16 text-primary mx-auto" />
                <p className="text-lg font-semibold text-foreground">Crafted with Love</p>
                <p className="text-muted-foreground">Every product tells a story</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          className={`space-y-12 transition-all duration-1000 delay-600 ${
            visibleSections.includes(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section
          className={`text-center space-y-12 transition-all duration-1000 delay-800 ${
            visibleSections.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Behind every great product is a passionate team dedicated to excellence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO", image: "/professional-woman-ceo.png" },
              { name: "Michael Chen", role: "Head of Product", image: "/professional-product-manager.png" },
              { name: "Emily Rodriguez", role: "Customer Experience", image: "/professional-woman-customer-service.png" },
            ].map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`text-center space-y-8 py-16 transition-all duration-1000 delay-1000 ${
            visibleSections.includes(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Experience Excellence?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Earthy Aromas for their premium product needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
