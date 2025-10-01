interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isUser: boolean
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${message.isUser ? 'order-2' : 'order-1'}`}>
        <div className={`p-3 rounded-lg ${
          message.isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 bg-opacity-50 text-white'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={`text-xs text-gray-400 mt-1 ${
          message.isUser ? 'text-right' : 'text-left'
        }`}>
          {message.sender} • {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
  
  