'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Loader2, User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'How do I find my first 100 customers?',
  'What should my pitch deck cover?',
  'How should I price this product?',
  'What are the biggest risks I should worry about?',
  'How do I validate demand before building?',
  'What metrics should I track at launch?',
];

export default function IdeaCoachChat({ ideaId }: { ideaId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isStreaming) return;
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/validation/idea-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error('Failed');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No body');

      const decoder = new TextDecoder();
      let assistantMsg = '';
      let partialRead = '';

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partialRead += decoder.decode(value, { stream: true });
        const lines = partialRead.split('\n');
        partialRead = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMsg += parsed.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: assistantMsg };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border border-border/50 mb-8 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg"><MessageCircle className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">AI Idea Coach</h2>
          <p className="text-xs text-white/70">Ask anything about your business idea</p>
        </div>
      </div>

      <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">I&apos;m your AI startup coach. Ask me anything about your idea!</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-muted-foreground hover:text-indigo-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-tr-sm'
                : 'bg-white border shadow-sm rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content || (isStreaming && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : '')}</div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI coach a question..."
            className="flex-1 resize-none rounded-xl border border-border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[44px] max-h-[120px]"
            rows={1}
            disabled={isStreaming}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl h-[44px] w-[44px] shrink-0"
          >
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
