import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Send, Bot, User, Lightbulb, Search, FileText, Calendar } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Bonjour ! Je suis votre assistant IA pour SubvAfrica. Je peux vous aider à trouver des opportunités de financement, vérifier votre éligibilité, et vous guider dans vos candidatures. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
      suggestions: [
        "Comment vérifier mon éligibilité ?",
        "Quelles sont les opportunités disponibles ?",
        "Comment postuler à une subvention ?"
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: {}
        }),
      })

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getIntentIcon = (intent) => {
    const icons = {
      search_help: <Search className="h-4 w-4" />,
      application_help: <FileText className="h-4 w-4" />,
      deadline_info: <Calendar className="h-4 w-4" />,
      eligibility_check: <User className="h-4 w-4" />,
      general_question: <Lightbulb className="h-4 w-4" />
    }
    return icons[intent] || <Bot className="h-4 w-4" />
  }

  const getIntentColor = (intent) => {
    const colors = {
      search_help: 'bg-blue-100 text-blue-800',
      application_help: 'bg-green-100 text-green-800',
      deadline_info: 'bg-yellow-100 text-yellow-800',
      eligibility_check: 'bg-purple-100 text-purple-800',
      general_question: 'bg-gray-100 text-gray-800'
    }
    return colors[intent] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Assistant IA</h1>
          <p className="text-gray-600">
            Posez vos questions sur les opportunités de financement, l'éligibilité et les candidatures.
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Chat avec l'Assistant IA
            </CardTitle>
            <CardDescription>
              Assistant intelligent pour vous guider dans vos recherches de financement
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'bot' && (
                          <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {message.intent && (
                            <div className="mt-2">
                              <Badge className={`text-xs ${getIntentColor(message.intent)}`}>
                                {getIntentIcon(message.intent)}
                                <span className="ml-1">{message.intent.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                          )}
                          
                          {message.suggestions && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs text-gray-500 mb-2">Suggestions :</p>
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="mr-2 mb-1 text-xs"
                                  onClick={() => sendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  onClick={() => sendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage("Quelles sont les opportunités en technologie ?")}
                  disabled={loading}
                >
                  Opportunités tech
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage("Comment générer une lettre de motivation ?")}
                  disabled={loading}
                >
                  Génération de documents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage("Quelles sont les échéances importantes ?")}
                  disabled={loading}
                >
                  Échéances
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations d'aide */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">Recherche d'opportunités</h3>
              </div>
              <p className="text-sm text-gray-600">
                Demandez-moi de trouver des opportunités selon vos critères
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Aide aux candidatures</h3>
              </div>
              <p className="text-sm text-gray-600">
                Je peux vous guider dans le processus de candidature
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold">Vérification d'éligibilité</h3>
              </div>
              <p className="text-sm text-gray-600">
                Vérifiez si vous êtes éligible à une opportunité
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

