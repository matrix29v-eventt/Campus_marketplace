"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Send, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/AuthGuard"
import type { MessageData, UserData } from "@/lib/types"

function ChatContent() {
  const searchParams = useSearchParams()
  const initialUserId = searchParams.get("userId")
  const initialProductId = searchParams.get("productId")

  const [messages, setMessages] = useState<MessageData[]>([])
  const [conversations, setConversations] = useState<{ user: UserData; lastMessage: MessageData }[]>([])
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setCurrentUser(d)
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch("/api/chat", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: MessageData[]) => {
        if (Array.isArray(data)) {
          setMessages(data)
          const convMap = new Map<string, { user: UserData; lastMessage: MessageData }>()
          data.forEach((msg) => {
            const otherUser = msg.senderId === currentUser?.id ? msg.receiver : msg.sender
            if (otherUser && !convMap.has(otherUser.id)) {
              convMap.set(otherUser.id, { user: otherUser, lastMessage: msg })
            }
          })
          const convs = Array.from(convMap.values())
          setConversations(convs)
          if (initialUserId && currentUser) {
            const conv = convs.find((c) => c.user.id === initialUserId)
            if (conv) setSelectedUser(conv.user)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentUser, initialUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async (otherUserId: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    const params = new URLSearchParams({ userId: otherUserId })
    if (initialProductId) params.set("productId", initialProductId)

    const res = await fetch(`/api/chat?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (Array.isArray(data)) setMessages(data)
  }

  const selectUser = (user: UserData) => {
    setSelectedUser(user)
    fetchMessages(user.id)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receiverId: selectedUser.id, productId: initialProductId, content: newMessage.trim() }),
    })
    if (res.ok) {
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
      setNewMessage("")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Messages
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[60vh] flex">
        <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => selectUser(conv.user)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                    selectedUser?.id === conv.user.id ? "bg-emerald-50 dark:bg-emerald-900/30" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="font-semibold text-emerald-700 text-sm">
                      {conv.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{conv.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage.content}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                No conversations yet
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="font-semibold text-emerald-700 text-sm">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.department || "Student"}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${
                        isMine ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? "text-emerald-200" : "text-gray-400 dark:text-gray-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }>
        <ChatContent />
      </Suspense>
    </AuthGuard>
  )
}
