"use client"

import type React from "react"

import { useState } from "react"
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
import { usePhoneAuth } from "@/hooks/use-phone-auth"
import { Phone, Shield, User } from "lucide-react"

export function PhoneAuthDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")

  const { login, verifyOTP, isLoading, error } = usePhoneAuth()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    try {
      await login(phoneNumber)
      setStep("otp")
    } catch (error) {
      console.error("Failed to send OTP:", error)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return

    try {
      await verifyOTP(otp)
      setIsOpen(false)
      setStep("phone")
      setPhoneNumber("")
      setOtp("")
    } catch (error) {
      console.error("Failed to verify OTP:", error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setStep("phone")
    setPhoneNumber("")
    setOtp("")
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
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-green-600" />
            <span>{step === "phone" ? "Login with Phone" : "Verify OTP"}</span>
          </DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : "Enter the 6-digit code sent to your phone"}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <div className="text-sm text-gray-600 text-center">Code sent to {phoneNumber}</div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setStep("phone")}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>

            <div className="text-center">
              <Button type="button" variant="ghost" size="sm" onClick={handleSendOTP} disabled={isLoading}>
                Resend Code
              </Button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-4 border-t">
          <Shield className="h-3 w-3" />
          <span>Your phone number is secure and encrypted</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
