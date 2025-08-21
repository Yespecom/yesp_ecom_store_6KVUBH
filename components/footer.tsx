import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-black font-montserrat text-primary">Earthy Aromas</h3>
            <p className="text-muted-foreground">
              Your trusted destination for premium aromatic products with natural ingredients and exceptional quality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-all duration-200 hover:scale-110" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-all duration-200 hover:scale-110" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-all duration-200 hover:scale-110" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-all duration-200 hover:scale-110" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/#categories"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Info</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="transition-colors duration-200 hover:text-foreground">123 Aromatic Street</p>
              <p className="transition-colors duration-200 hover:text-foreground">Natural Valley, NY 10001</p>
              <p className="transition-colors duration-200 hover:text-foreground">Phone: (555) 123-4567</p>
              <p className="transition-colors duration-200 hover:text-foreground">Email: hello@earthyaromas.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p className="transition-colors duration-200 hover:text-foreground">
            &copy; 2024 Earthy Aromas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
