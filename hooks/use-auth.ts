"use client"

import { useState, useEffect } from "react"
import { login as apiLogin, register as apiRegister, type User } from "@/lib/api"

interface UseAuthReturn {
  user: User | null
  isAuthenticated: () => boolean
  login: (email: string, password: string) => Promise<void>
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

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("auth_user")

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiLogin(email, password)
      if (response && response.success) {
        setUser(response.user)
        localStorage.setItem("auth_user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)
      }
    } catch (err) {
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

    try {
      const response = await apiRegister(userData)
      if (response && response.success) {
        setUser(response.user)
        localStorage.setItem("auth_user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("auth_token")
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
