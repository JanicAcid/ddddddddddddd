'use client'

export function OpenChatButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href="https://t.me/+79219403870"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
