"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, type User } from "@/lib/api"

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("auth_user")

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
  }, [])

  const login = async (email: string, password: string, recaptchaToken?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiLogin(email, password, recaptchaToken)
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
