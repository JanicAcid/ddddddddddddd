'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  text: string
  from: string
  timestamp: number
  isMe: boolean
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [visitorName, setVisitorName] = useState<string | null>(null)
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [operatorAvailable, setOperatorAvailable] = useState<boolean | null>(
    null
  )
  const [showNameInput, setShowNameInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const sessionIdRef = useRef<string>('')
  const sentMsgIdsRef = useRef<number[]>([])
  const offsetRef = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chat_session_id')
    const storedName = localStorage.getItem('chat_visitor_name')

    if (!storedSessionId) {
      const newId = generateUUID()
      localStorage.setItem('chat_session_id', newId)
      sessionIdRef.current = newId
    } else {
      sessionIdRef.current = storedSessionId
    }

    if (storedName) {
      setVisitorName(storedName)
      setNameSubmitted(true)
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check operator availability
  useEffect(() => {
    if (!isOpen || operatorAvailable !== null) return

    const checkAvailability = async () => {
      try {
        const res = await fetch('/api/chat/poll?offset=0&msgIds=')
        if (res.ok) {
          setOperatorAvailable(true)
        } else if (res.status === 503) {
          setOperatorAvailable(false)
        } else {
          setOperatorAvailable(true)
        }
      } catch {
        setOperatorAvailable(false)
      }
    }

    checkAvailability()
  }, [isOpen, operatorAvailable])

  // Show name input when chat opens and name not set
  useEffect(() => {
    if (isOpen && !nameSubmitted) {
      setShowNameInput(true)
    }
  }, [isOpen, nameSubmitted])

  // Polling for replies
  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return

    const poll = async () => {
      if (sentMsgIdsRef.current.length === 0) return

      try {
        const msgIds = sentMsgIdsRef.current.join(',')
        const offset = offsetRef.current
        const res = await fetch(
          `/api/chat/poll?offset=${offset}&msgIds=${encodeURIComponent(msgIds)}`
        )

        if (!res.ok) return

        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          offsetRef.current = data.offset

          const newMessages: ChatMessage[] = data.messages.map(
            (msg: { text: string; from: string; timestamp: number }) => ({
              text: msg.text,
              from: msg.from,
              timestamp: msg.timestamp,
              isMe: false,
            })
          )

          setMessages((prev) => [...prev, ...newMessages])
        }
      } catch {
        // Silently fail on poll errors
      }
    }

    pollTimerRef.current = setInterval(poll, 3000)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  // Start/stop polling based on chat open state and name submitted
  useEffect(() => {
    if (isOpen && nameSubmitted) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [isOpen, nameSubmitted, startPolling, stopPolling])

  // Add welcome message when chat first opens
  useEffect(() => {
    if (isOpen && nameSubmitted && messages.length === 0) {
      setMessages([
        {
          text: 'Здравствуйте! Чем могу помочь? Напишите ваш вопрос, и наш специалист ответит в Telegram.',
          from: 'Теллур-Интех',
          timestamp: Date.now(),
          isMe: false,
        },
      ])
    }
  }, [isOpen, nameSubmitted])

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return

    setVisitorName(trimmed)
    setNameSubmitted(true)
    setShowNameInput(false)
    localStorage.setItem('chat_visitor_name', trimmed)
    setNameInput('')
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNameSubmit()
    }
  }

  const sendMessage = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || sending) return

    setSending(true)
    setErrorMessage(null)

    // Optimistically add message
    const optimisticMsg: ChatMessage = {
      text: trimmedInput,
      from: visitorName || 'Вы',
      timestamp: Date.now(),
      isMe: true,
    }
    setMessages((prev) => [...prev, optimisticMsg])
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: trimmedInput,
          name: visitorName || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Ошибка отправки сообщения')
        // Remove optimistic message
        setMessages((prev) => prev.slice(0, -1))
        setInput(trimmedInput)
      } else if (data.botMessageId) {
        sentMsgIdsRef.current.push(data.botMessageId)
      }
    } catch {
      setErrorMessage('Ошибка соединения')
      setMessages((prev) => prev.slice(0, -1))
      setInput(trimmedInput)
    } finally {
      setSending(false)
      // Auto-dismiss error
      setTimeout(() => setErrorMessage(null), 4000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-grow textarea (max 3 lines ~ 72px)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 72)}px`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      <div
        className={`relative flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-[380px] h-[500px] opacity-100 translate-y-0 scale-100'
            : 'w-0 h-0 opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        style={{ boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.25)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ backgroundColor: '#1e3a5f' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">
                Теллур-Интех
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white/80 text-xs">Онлайн</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Закрыть чат"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div
              key={`${idx}-${msg.timestamp}`}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3.5 py-2.5 ${
                  msg.isMe
                    ? 'rounded-2xl rounded-br-md text-white'
                    : 'rounded-2xl rounded-bl-md bg-white text-gray-900 shadow-sm'
                }`}
                style={
                  msg.isMe ? { backgroundColor: '#1e3a5f' } : undefined
                }
              >
                {!msg.isMe && (
                  <p className="text-xs font-medium mb-0.5" style={{ color: '#1e3a5f' }}>
                    {msg.from}
                  </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.isMe ? 'text-white/60' : 'text-gray-400'
                  } text-right`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="px-4 py-2 bg-red-50 text-red-600 text-xs text-center shrink-0">
            {errorMessage}
          </div>
        )}

        {/* Operator not configured warning */}
        {operatorAvailable === false && (
          <div className="px-4 py-2 bg-amber-50 text-amber-700 text-xs text-center shrink-0">
            Чат временно недоступен. Попробуйте позже.
          </div>
        )}

        {/* Name Input */}
        {showNameInput && (
          <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Как к вам обращаться?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleNameKeyDown}
                placeholder="Ваше имя"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors"
                autoFocus
              />
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                Начать чат
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        {!showNameInput && nameSubmitted && (
          <div className="p-3 border-t border-gray-100 shrink-0 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Напишите сообщение..."
                rows={1}
                className="flex-1 resize-none px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors leading-relaxed"
                style={{ maxHeight: '72px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1e3a5f' }}
                aria-label="Отправить"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#1e3a5f' }}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}
