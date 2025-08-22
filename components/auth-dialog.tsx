"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const loadRecaptchaScript = async () => {
  return new Promise<string>((resolve, reject) => {
    if (window.grecaptcha && window.grecaptcha.ready) {
      // If already loaded, fetch the site key from backend
      fetch("/api/recaptcha-config")
        .then((res) => res.json())
        .then((data) => {
          if (data.siteKey) {
            resolve(data.siteKey)
          } else {
            reject(new Error("No site key received from server"))
          }
        })
        .catch(reject)
      return
    }

    // Fetch site key from backend first
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        if (!data.siteKey) {
          throw new Error("No site key received from server")
        }

        const siteKey = data.siteKey
        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`

        script.onload = () => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => {
              console.log("[v0] reCAPTCHA script loaded and ready")
              resolve(siteKey)
            })
          } else {
            reject(new Error("reCAPTCHA script loaded but grecaptcha object not available"))
          }
        }

        script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"))
        document.head.appendChild(script)
      })
      .catch(reject)
  })
}

export function AuthDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const [recaptchaLoading, setRecaptchaLoading] = useState(true)
  const [recaptchaAvailable, setRecaptchaAvailable] = useState(false)
  const { login, register, isLoading, error } = useAuth()

  useEffect(() => {
    setRecaptchaLoading(true)
    loadRecaptchaScript()
      .then((key) => {
        setSiteKey(key)
        setRecaptchaAvailable(true)
        setRecaptchaLoading(false)
        console.log("[v0] reCAPTCHA initialized successfully")
      })
      .catch((error) => {
        console.error("[v0] reCAPTCHA initialization failed:", error)
        setRecaptchaAvailable(false)
        setRecaptchaLoading(false)
      })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("[v0] Login form data:", { email, password: password ? "[REDACTED]" : "empty" })

    try {
      let recaptchaToken = null

      if (recaptchaAvailable && siteKey) {
        if (!window.grecaptcha || !window.grecaptcha.execute) {
          throw new Error("reCAPTCHA service not available. Please check your internet connection and try again.")
        }

        console.log("[v0] Executing reCAPTCHA for login with site key:", siteKey)
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: "login" })

        if (!recaptchaToken) {
          throw new Error("Failed to generate reCAPTCHA token. Please try again.")
        }

        console.log("[v0] reCAPTCHA v3 token generated for login")
      } else {
        console.log("[v0] reCAPTCHA not available, proceeding without verification")
      }

      await login(email, password, recaptchaToken)
      setIsOpen(false)
      // Force a re-render by dispatching a custom event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("auth-state-changed"))
      }, 100)
    } catch (error) {
      console.log("[v0] Login error caught in component:", error)
      // Error is handled by the useAuth hook
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("[v0] Signup form data:", { name, email, password: password ? "[REDACTED]" : "empty" })

    try {
      let recaptchaToken = null

      if (recaptchaAvailable && siteKey) {
        if (!window.grecaptcha || !window.grecaptcha.execute) {
          throw new Error("reCAPTCHA service not available. Please check your internet connection and try again.")
        }

        console.log("[v0] Executing reCAPTCHA with site key:", siteKey)
        recaptchaToken = await window.grecaptcha.execute(siteKey, { action: "register" })

        if (!recaptchaToken) {
          throw new Error("Failed to generate reCAPTCHA token. Please try again.")
        }

        console.log("[v0] reCAPTCHA v3 token generated for registration")
      } else {
        console.log("[v0] reCAPTCHA not available, proceeding without verification")
      }

      await register({ name, email, password, recaptchaToken })
      setIsOpen(false)
      // Force a re-render by dispatching a custom event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("auth-state-changed"))
      }, 100)
    } catch (error) {
      console.log("[v0] Signup error caught in component:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 md:h-10 md:w-auto md:px-4 p-0 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <User className="h-4 w-4 md:mr-2 text-gray-700" />
          <span className="hidden md:inline">Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Earthy Aromas</DialogTitle>
          <DialogDescription>Login to your account or create a new one to continue</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" name="email" type="email" placeholder="your@email.com" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" name="name" type="text" placeholder="John Doe" className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {recaptchaLoading && <p className="text-sm text-gray-500">Loading security verification...</p>}

              {!recaptchaLoading && !recaptchaAvailable && (
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Security verification is not configured. Please contact support if you encounter issues.
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || recaptchaLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
