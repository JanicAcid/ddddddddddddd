'use client'

export function OpenChatButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).Tawk_API) {
          (window as any).Tawk_API.toggle()
        }
      }}
      className={className}
    >
      {children}
    </button>
  )
}
