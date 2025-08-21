import { NextResponse } from "next/server"

export async function GET() {
  try {
    const siteKey = process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

    return NextResponse.json({
      siteKey,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching reCAPTCHA config:", error)
    return NextResponse.json({ error: "Failed to fetch reCAPTCHA configuration" }, { status: 500 })
  }
}
