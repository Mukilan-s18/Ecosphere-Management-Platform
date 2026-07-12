"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is our e-waste recycling policy?",
  "Can I book a first-class flight?",
  "What counts as a conflict of interest?",
  "How do I report a policy violation?",
];

export function ESGOracle() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the **ESG Oracle** 🌿 — your AI guide to EcoSphere's sustainability and governance policies.\n\nAsk me anything like *\"What is our travel policy?\"* or *\"How do I report a violation?\"*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "Sorry, I couldn't get a response. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Connection error. Please check your network and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-like renderer for bold and italic
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <li key={i} className="ml-4 list-disc">
            {renderContent(line.slice(2))}
          </li>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="leading-relaxed">{renderContent(line)}</p>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="esg-oracle-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 font-semibold text-sm shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          isOpen
            ? "bg-slate-700 text-white hover:bg-slate-600"
            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 hover:scale-105 hover:shadow-emerald-500/30"
        }`}
        aria-label={isOpen ? "Close ESG Oracle" : "Open ESG Oracle"}
      >
        {isOpen ? (
          <>
            <X className="size-4" />
            <span>Close</span>
          </>
        ) : (
          <>
            <Sparkles className="size-4 animate-pulse" />
            <span>ESG Oracle</span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-6 z-50 flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/50 transition-all duration-300 ${
          isOpen
            ? "w-[380px] h-[560px] opacity-100 translate-y-0 pointer-events-auto"
            : "w-[380px] h-[560px] opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-label="ESG Oracle Chat"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-700/60 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Sparkles className="size-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">ESG Oracle</h2>
            <p className="text-xs text-emerald-400/80">AI Policy Assistant · Always available</p>
          </div>
          <div className="ml-auto flex size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="size-3.5" />
                ) : (
                  <Bot className="size-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/50"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="space-y-1">{formatMessage(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2">
              <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-700/50 bg-slate-800 px-3 py-3">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                <span className="size-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (shown only if only welcome message) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-4 pb-2">
            <p className="mb-2 text-xs text-slate-500">Suggested questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-emerald-800/60 bg-emerald-950/50 px-2.5 py-1 text-xs text-emerald-300 transition hover:bg-emerald-900/60 hover:border-emerald-600"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-700/60 p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              id="esg-oracle-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any ESG policy..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-60"
            />
            <button
              id="esg-oracle-send"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md transition hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </form>
          <p className="mt-1.5 text-center text-[10px] text-slate-600">
            Powered by Gemini AI · Policies updated Q3 2026
          </p>
        </div>
      </div>
    </>
  );
}
