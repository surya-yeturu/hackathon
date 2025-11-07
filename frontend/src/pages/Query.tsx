import { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { wsService } from '../services/websocket';

const API_URL = 'http://localhost:8080/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Query() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. Ask me anything about your team's productivity, tasks, or performance metrics. I'll analyze data from your MongoDB database to give you accurate answers. Try questions like:\n\n• How many tasks are open?\n• What's the completion rate?\n• Which projects have the most tasks?\n• How many tasks were closed today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingQueryRef = useRef<string | null>(null);

  useEffect(() => {
    // Connect WebSocket if not already connected
    if (!wsService.isConnected()) {
      wsService.connect();
    }

    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'ai_insight' && pendingQueryRef.current) {
        const response = message.data?.response || 'I received your query. Processing...';
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: response,
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        pendingQueryRef.current = null;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    pendingQueryRef.current = question;

    try {
      // Try WebSocket first
      if (wsService.isConnected()) {
        wsService.send({
          type: 'query',
          question: question,
        });
        
        // Set timeout fallback to REST API if WebSocket doesn't respond
        setTimeout(async () => {
          if (pendingQueryRef.current === question) {
            // WebSocket didn't respond, use REST API
            await fetchAIResponse(question);
          }
        }, 3000);
      } else {
        // WebSocket not connected, use REST API directly
        await fetchAIResponse(question);
      }
    } catch (error) {
      console.error('Error sending query:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your query. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      pendingQueryRef.current = null;
    }
  };

  const fetchAIResponse = async (question: string) => {
    try {
      const response = await fetch(`${API_URL}/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || 'I received your query, but got an empty response.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I couldn\'t process your query right now. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (pendingQueryRef.current === question) {
        pendingQueryRef.current = null;
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Conversational Query Interface</h2>
        <p className="text-dark-muted">Ask questions about your team's productivity in natural language</p>
      </div>

      <div className="bg-dark-card rounded-lg border border-dark-border flex flex-col h-[calc(100vh-300px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-bg text-dark-text border border-dark-border'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-dark-muted">AI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-dark-muted'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-500 animate-pulse" />
                  <span className="text-dark-muted">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-dark-border p-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your team's productivity..."
              className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

