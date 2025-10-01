'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Calendar, User, Edit2, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChatMessage from '@/components/ChatMessage'
import MessageInput from '@/components/MessageInput'
import ScrollToTop from '@/components/ScrollToTop'

interface Conversation {
  id: string
  title: string
  participants: string[]
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isUser: boolean
}

export default function Chatroom() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [newConversationTitle, setNewConversationTitle] = useState('')
  const [newParticipant, setNewParticipant] = useState('')

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('perceptr-conversations')
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setConversations(parsed)
      if (parsed.length > 0) {
        setCurrentConversation(parsed[0])
      }
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('perceptr-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  const createConversation = () => {
    if (!newConversationTitle.trim()) return

    const newConv: Conversation = {
      id: Date.now().toString(),
      title: newConversationTitle,
      participants: [user?.name || 'You'],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setConversations([newConv, ...conversations])
    setCurrentConversation(newConv)
    setNewConversationTitle('')
    setIsCreatingConversation(false)
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(conv => conv.id !== id)
    setConversations(updated)
    if (currentConversation?.id === id) {
      setCurrentConversation(updated.length > 0 ? updated[0] : null)
    }
  }

  const addParticipant = () => {
    if (!newParticipant.trim() || !currentConversation) return

    const updatedConv = {
      ...currentConversation,
      participants: [...currentConversation.participants, newParticipant],
      updatedAt: new Date()
    }

    setCurrentConversation(updatedConv)
    setConversations(conversations.map(conv => 
      conv.id === currentConversation.id ? updatedConv : conv
    ))
    setNewParticipant('')
  }

  const handleSendMessage = (content: string) => {
    if (!currentConversation || !content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      content,
      timestamp: new Date(),
      isUser: true
    }

    const updatedConv = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updatedAt: new Date()
    }

    setCurrentConversation(updatedConv)
    setConversations(conversations.map(conv => 
      conv.id === currentConversation.id ? updatedConv : conv
    ))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="flex h-screen text-white pt-8">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-gray-900 bg-opacity-30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{currentConversation.title}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {currentConversation.participants.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    placeholder="Add participant..."
                    className="bg-gray-700 bg-opacity-50 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <Button
                    onClick={addParticipant}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentConversation.messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                currentConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Welcome to Perceptr Chat</h3>
              <p className="text-sm mb-4">Track your real-life conversations</p>
              <Button
                onClick={() => setIsCreatingConversation(true)}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  )
}

