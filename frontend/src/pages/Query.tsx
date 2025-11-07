import { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { wsService } from '../services/websocket';

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
      text: "Hello! I'm your AI assistant. Ask me anything about your team's productivity, tasks, or performance metrics. Try questions like:",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'ai_insight') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: message.data.response || 'I received your query. Processing...',
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Send query via WebSocket
    wsService.send({
      type: 'query',
      question: input,
    });

    // Simulate AI response (in real app, this comes from WebSocket)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMockResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('bug') || lowerQuestion.includes('close')) {
      return 'Currently tracking 15 bugs total. 5 have been closed this week, and 10 are still open.';
    } else if (lowerQuestion.includes('task') && lowerQuestion.includes('complete')) {
      return 'Your team has completed 26 tasks this week, with an average completion time of 58.1 hours.';
    } else if (lowerQuestion.includes('progress') || lowerQuestion.includes('velocity')) {
      return 'Task completion velocity has decreased by 17.6% this week, indicating potential bottlenecks. There are 12 tasks currently in progress.';
    } else if (lowerQuestion.includes('team') || lowerQuestion.includes('member')) {
      return 'Your team consists of 9 active members. Alice has completed 1 task, Bob has 1 ongoing task, and Carol has completed 2 tasks this week.';
    } else if (lowerQuestion.includes('blocked')) {
      return 'There are 11 blocked tasks requiring attention. These are primarily in the API Services project.';
    } else {
      return "I understand your question. Based on the current data, I can help you analyze team productivity metrics, task completion rates, and identify potential bottlenecks. What specific information would you like to know?";
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

