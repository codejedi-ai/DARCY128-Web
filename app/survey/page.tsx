'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Play, Pause, Square, Brain, Heart, Users, Lightbulb, Volume2 } from 'lucide-react'
import { useUser } from '@auth0/nextjs-auth0'
import React from 'react'
import ScrollToTop from '@/components/ScrollToTop'

interface ConversationInsight {
  id: string
  type: 'tip' | 'question' | 'encouragement' | 'analysis'
  content: string
  timestamp: Date
}

export default function VoiceAgentPage() {
  const { user } = useUser()
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [insights, setInsights] = useState<ConversationInsight[]>([])
  const [currentInsight, setCurrentInsight] = useState<ConversationInsight | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Small talk insights and tips
  const smallTalkInsights = [
    {
      type: 'tip' as const,
      content: "Ask open-ended questions like 'What's been keeping you busy lately?' to encourage deeper conversation.",
      icon: Lightbulb
    },
    {
      type: 'question' as const,
      content: "Try asking about their weekend plans or recent experiences to find common ground.",
      icon: Users
    },
    {
      type: 'encouragement' as const,
      content: "Remember: Small talk builds bridges between people. You're creating meaningful connections!",
      icon: Heart
    },
    {
      type: 'analysis' as const,
      content: "Notice their body language and tone - it often reveals more than their words.",
      icon: Brain
    },
    {
      type: 'tip' as const,
      content: "Share a brief personal story to make the conversation more engaging and authentic.",
      icon: Lightbulb
    },
    {
      type: 'question' as const,
      content: "Ask about their current projects or what they're excited about these days.",
      icon: Users
    },
    {
      type: 'encouragement' as const,
      content: "You're doing great! Every conversation is practice for building emotional intelligence.",
      icon: Heart
    },
    {
      type: 'analysis' as const,
      content: "Listen for keywords they use - they often indicate their interests and values.",
      icon: Brain
    }
  ]

  useEffect(() => {
    // Generate random insights during recording
    if (isRecording && !isPaused) {
      const insightInterval = setInterval(() => {
        const randomInsight = smallTalkInsights[Math.floor(Math.random() * smallTalkInsights.length)]
        const newInsight: ConversationInsight = {
          id: Date.now().toString(),
          type: randomInsight.type,
          content: randomInsight.content,
          timestamp: new Date()
        }
        setInsights(prev => [...prev, newInsight])
        setCurrentInsight(newInsight)
        
        // Auto-hide insight after 5 seconds
        setTimeout(() => {
          setCurrentInsight(null)
        }, 5000)
      }, 15000) // Show insight every 15 seconds

      return () => clearInterval(insightInterval)
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use the voice agent')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    setIsRecording(false)
    setIsPaused(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        audioRef.current.onended = () => setIsPlaying(false)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const clearSession = () => {
    setTranscript('')
    setInsights([])
    setCurrentInsight(null)
    setRecordingTime(0)
    if (audioRef.current) {
      audioRef.current.src = ''
    }
  }

  return (
      <div className="min-h-screen text-white pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-blue-400" />
            Perceptr Voice Agent
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Perceptr helps you master the art of small talk. Many intelligent people stereotype small talk as trivial, 
            but they miss that it's the foundation of emotional intelligence - the ultimate intelligence that brings people together, 
            understanding pain points, values, and experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recording Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Mic className="w-6 h-6 mr-2" />
              Voice Recording
            </h2>

            {/* Recording Controls */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}>
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </div>
                
                <div className="text-3xl font-mono mb-2">
                  {formatTime(recordingTime)}
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={pauseRecording}
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            {recordingTime > 0 && !isRecording && (
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold mb-4">Playback</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={playRecording}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    onClick={clearSession}
                    variant="outline"
                    className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                  >
                    Clear Session
                  </Button>
                </div>
                <audio ref={audioRef} className="hidden" />
              </div>
            )}
          </motion.div>

          {/* Insights Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Small Talk Insights
            </h2>

            {/* Current Insight */}
            <AnimatePresence>
              {currentInsight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-4 rounded-lg mb-6 border-l-4 ${
                    currentInsight.type === 'tip' ? 'bg-blue-500/20 border-blue-500' :
                    currentInsight.type === 'question' ? 'bg-green-500/20 border-green-500' :
                    currentInsight.type === 'encouragement' ? 'bg-purple-500/20 border-purple-500' :
                    'bg-orange-500/20 border-orange-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {React.createElement(smallTalkInsights.find(i => i.type === currentInsight.type)?.icon || Lightbulb, {
                      className: `w-5 h-5 mt-0.5 ${
                        currentInsight.type === 'tip' ? 'text-blue-400' :
                        currentInsight.type === 'question' ? 'text-green-400' :
                        currentInsight.type === 'encouragement' ? 'text-purple-400' :
                        'text-orange-400'
                      }`
                    })}
                    <div>
                      <p className="text-sm font-medium capitalize mb-1">{currentInsight.type}</p>
                      <p className="text-white">{currentInsight.content}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Insights History */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {insights.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start recording to receive real-time small talk insights!</p>
                </div>
              ) : (
                insights.slice().reverse().map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3 rounded-lg bg-gray-800/30 border border-white/10"
                  >
                    <div className="flex items-start space-x-3">
                      {React.createElement(smallTalkInsights.find(i => i.type === insight.type)?.icon || Lightbulb, {
                        className: `w-4 h-4 mt-0.5 ${
                          insight.type === 'tip' ? 'text-blue-400' :
                          insight.type === 'question' ? 'text-green-400' :
                          insight.type === 'encouragement' ? 'text-purple-400' :
                          'text-orange-400'
                        }`
                      })}
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">
                          {formatTime(Math.floor((Date.now() - insight.timestamp.getTime()) / 1000))} ago
                        </p>
                        <p className="text-sm text-white">{insight.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-pink-400" />
            The Power of Small Talk
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2 text-blue-300">Emotional Intelligence</h4>
              <p className="text-gray-300">
                Small talk is the foundation of emotional intelligence - the ultimate intelligence that brings people together, 
                understanding pain points, values, and experiences.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2 text-green-300">Building Connections</h4>
              <p className="text-gray-300">
                Through small talk, we experience the lives of others, creating bridges between different worlds and perspectives.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <ScrollToTop />
    </div>
  )
}