'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

// Замените на реальный GA4 Measurement ID, когда получите доступ к Google Analytics
const GA_ID = 'G-XXXXXXXXXX'

const CONSENT_KEY = 'cookie-consent-accepted'
const CONSENT_EVENT = 'cookie-consent-changed'

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return data?.accepted === true && data?.categories?.analytics_google === true
  } catch {
    return false
  }
}

export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Не загружаем без реального ID
    if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return
    setConsentGiven(hasAnalyticsConsent())

    const handleConsentChange = () => {
      setConsentGiven(hasAnalyticsConsent())
    }

    window.addEventListener(CONSENT_EVENT, handleConsentChange)
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentChange)
  }, [])

  if (!consentGiven || !GA_ID || GA_ID === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}', {
            send_page_view: true,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  )
}
