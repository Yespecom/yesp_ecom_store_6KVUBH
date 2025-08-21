import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-16 lg:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-foreground mb-4">Stay Updated</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special
              promotions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email address" className="flex-1 bg-background border-border" />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
