"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  phone: string
}

interface UsePhoneAuthReturn {
  user: User | null
  isAuthenticated: boolean
  login: (phoneNumber: string) => Promise<void>
  verifyOTP: (otp: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export function usePhoneAuth(): UsePhoneAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (phoneNumber: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would call your API to send OTP
      console.log("Sending OTP to:", phoneNumber)
      setPendingPhone(phoneNumber)
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (otp: string) => {
    if (!pendingPhone) {
      setError("No phone number pending verification")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would verify the OTP with your API
      if (otp === "123456" || otp.length === 6) {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: `User ${pendingPhone.slice(-4)}`,
          phone: pendingPhone,
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        setPendingPhone(null)
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setPendingPhone(null)
    localStorage.removeItem("user")
  }

  return {
    user,
    isAuthenticated: !!user,
    login,
    verifyOTP,
    logout,
    isLoading,
    error,
  }
}
