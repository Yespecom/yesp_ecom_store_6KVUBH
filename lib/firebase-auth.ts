// Firebase Phone Authentication utilities
import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type Auth, type ConfirmationResult } from "firebase/auth"

let app: FirebaseApp | null = null
let auth: Auth | null = null

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export interface PhoneAuthResponse {
  success: boolean
  message: string
  phone: string
  purpose: string
  method: string
  provider: string
  recaptcha: {
    version: string
    siteKey: string
    required: boolean
  }
  expiresIn: string
  otpId: string
  instructions: string
}

export interface VerifyOTPResponse {
  message: string
  token: string
  customer: {
    id: string
    name: string
    email?: string
    phone: string
    totalSpent: number
    totalOrders: number
    isVerified: boolean
    phoneVerified: boolean
    preferences: {
      notifications: boolean
      marketing: boolean
      newsletter: boolean
      smsUpdates: boolean
    }
    tier: string
    createdAt: string
    lastLoginAt: string
  }
  storeId: string
  tenantId: string
  tokenInfo: {
    issuedAt: string
    expiresAt: string
    isExpired: boolean
    daysUntilExpiry: number
  }
  expiresIn: string
  authMethod: string
  firebaseUid: string
  firebaseCustomToken: string
  isNewCustomer: boolean
  accountStatus: string
}

const API_BASE_URL = "https://api.yespstudio.com/api/6KVUBH"

export async function getFirebaseConfig(): Promise<{ config: FirebaseConfig; recaptcha: any } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/firebase-otp/firebase-config`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      return { config: data.config, recaptcha: data.recaptcha }
    }

    throw new Error(data.message || "Failed to get Firebase config")
  } catch (error) {
    console.error("Error getting Firebase config:", error)
    return null
  }
}

export async function initializeFirebase(): Promise<{ app: FirebaseApp; auth: Auth } | null> {
  try {
    if (app && auth) {
      return { app, auth }
    }

    const configData = await getFirebaseConfig()
    if (!configData) {
      throw new Error("Failed to get Firebase configuration")
    }

    app = initializeApp(configData.config)
    auth = getAuth(app)

    return { app, auth }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
    return null
  }
}

export async function setupRecaptcha(containerId: string): Promise<RecaptchaVerifier | null> {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) {
      throw new Error("Firebase not initialized")
    }

    // Get reCAPTCHA configuration from API
    const configData = await getFirebaseConfig()
    if (!configData?.recaptcha) {
      throw new Error("reCAPTCHA configuration not available")
    }

    const recaptchaVerifier = new RecaptchaVerifier(firebase.auth, containerId, {
      size: "invisible",
      callback: (response: any) => {
        console.log("[v0] reCAPTCHA solved successfully")
      },
      "expired-callback": () => {
        console.log("[v0] reCAPTCHA expired, refreshing...")
      },
      "error-callback": (error: any) => {
        console.error("[v0] reCAPTCHA error:", error)
      },
    })

    // Render the reCAPTCHA
    await recaptchaVerifier.render()
    console.log("[v0] reCAPTCHA rendered successfully")

    return recaptchaVerifier
  } catch (error) {
    console.error("Error setting up reCAPTCHA:", error)
    return null
  }
}

export async function sendOTP(phone: string, purpose = "login"): Promise<PhoneAuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/firebase-otp/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, purpose }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      return data
    }

    throw new Error(data.message || "Failed to send OTP")
  } catch (error) {
    console.error("Error sending OTP:", error)
    return null
  }
}

export async function sendFirebaseOTP(
  phone: string,
  recaptchaVerifier: RecaptchaVerifier,
): Promise<ConfirmationResult | null> {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) {
      throw new Error("Firebase not initialized")
    }

    console.log("[v0] Attempting to send OTP to:", phone)

    // Ensure phone number is in international format
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`

    const confirmationResult = await signInWithPhoneNumber(firebase.auth, formattedPhone, recaptchaVerifier)
    console.log("[v0] Firebase OTP sent successfully")

    return confirmationResult
  } catch (error: any) {
    console.error("[v0] Error sending Firebase OTP:", error)

    // Handle specific Firebase auth errors
    if (error.code === "auth/captcha-check-failed") {
      throw new Error("reCAPTCHA verification failed. Please refresh the page and try again.")
    } else if (error.code === "auth/invalid-phone-number") {
      throw new Error("Invalid phone number format. Please enter a valid phone number.")
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many requests. Please try again later.")
    }

    throw error
  }
}

export async function verifyOTP(
  phone: string,
  firebaseIdToken: string,
  purpose = "login",
  name?: string,
  email?: string,
  rememberMe = true,
): Promise<VerifyOTPResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/firebase-otp/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        firebaseIdToken,
        purpose,
        name,
        email,
        rememberMe,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.token) {
      localStorage.setItem("auth_token", data.token)
      return data
    }

    throw new Error(data.message || "Failed to verify OTP")
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}
