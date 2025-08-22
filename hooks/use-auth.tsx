"use client"

import { useState, useEffect, useCallback } from "react"
import { login as apiLogin, register as apiRegister, type User } from "@/lib/api"

interface UseAuthReturn {
  user: User | null
  isAuthenticated: () => boolean
  login: (email: string, password: string, recaptchaToken?: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    phone?: string
    recaptchaToken?: string
  }) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStorageChange = useCallback((e: StorageEvent) => {
    if (e.key === "auth_user" || e.key === "auth_token") {
      const token = localStorage.getItem("auth_token")
      const savedUser = localStorage.getItem("auth_user")

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          console.log("[v0] Auth state synced from storage:", parsedUser.name)
        } catch (error) {
          console.error("[v0] Failed to parse user from storage sync:", error)
          setUser(null)
        }
      } else {
        setUser(null)
        console.log("[v0] User logged out in another tab")
      }
    }
  }, [])

  // Load user from localStorage on mount and set up storage listener
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("auth_user")

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        console.log("[v0] Auth state loaded on mount:", parsedUser.name)
      } catch (error) {
        console.error("[v0] Failed to parse saved user:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [handleStorageChange])

  const login = async (email: string, password: string, recaptchaToken?: string) => {
    setIsLoading(true)
    setError(null)
    console.log("[v0] Login attempt for:", email)

    try {
      const response = await apiLogin(email, password, recaptchaToken)
      if (response && response.success) {
        console.log("[v0] Login successful, updating state:", response.user.name)
        setUser(response.user)
        localStorage.setItem("auth_user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)

        setTimeout(() => {
          console.log("[v0] Auth state should be updated now")
        }, 100)
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
    recaptchaToken?: string
  }) => {
    setIsLoading(true)
    setError(null)
    console.log("[v0] Registration attempt for:", userData.email)

    try {
      const response = await apiRegister(userData)
      if (response && response.success) {
        console.log("[v0] Registration successful, updating state:", response.user.name)
        setUser(response.user)
        localStorage.setItem("auth_user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)

        setTimeout(() => {
          console.log("[v0] Auth state should be updated after registration")
        }, 100)
      }
    } catch (err) {
      console.error("[v0] Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user:", user?.name)
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  const isAuthenticated = () => {
    const authenticated = !!user && !!localStorage.getItem("auth_token")
    console.log("[v0] Auth check:", authenticated, user?.name || "no user")
    return authenticated
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
    error,
  }
}
