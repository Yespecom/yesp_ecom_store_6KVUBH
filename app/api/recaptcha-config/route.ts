import { NextResponse } from "next/server"

export async function GET() {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.error("RECAPTCHA_SITE_KEY environment variable is not set")
      return NextResponse.json({ error: "reCAPTCHA configuration not available", success: false }, { status: 500 })
    }

    return NextResponse.json({
      siteKey,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching reCAPTCHA config:", error)
    return NextResponse.json({ error: "Failed to fetch reCAPTCHA configuration", success: false }, { status: 500 })
  }
}
