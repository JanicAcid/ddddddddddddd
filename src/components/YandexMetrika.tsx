'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const YM_ID = 108406091

const CONSENT_KEY = 'cookie-consent-accepted'
const CONSENT_EVENT = 'cookie-consent-changed'

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return data?.accepted === true && data?.categories?.analytics_yandex === true
  } catch {
    return false
  }
}

export function YandexMetrika() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    setConsentGiven(hasAnalyticsConsent())

    const handleConsentChange = () => {
      setConsentGiven(hasAnalyticsConsent())
    }

    window.addEventListener(CONSENT_EVENT, handleConsentChange)
    return () => window.removeEventListener(CONSENT_EVENT, handleConsentChange)
  }, [])

  if (!consentGiven) {
    return null
  }

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

          ym(${YM_ID}, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            ecommerce: "dataLayer"
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
