import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

export const AIChatWidget = ({ isOpen, setIsOpen }) => {
  const { currentUser, t } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your EduSynk AI Learning Assistant. Ask me anything about finding exchange partners, match synergy, or skill roadmaps!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build safe student context
      const userContext = {
        name: currentUser.name,
        university: currentUser.university,
        major: currentUser.major,
        skillsToTeach: currentUser.teachSkills || [],
        skillsToLearn: currentUser.learnSkills || [],
        reputationScore: currentUser.reputationScore || 95
      };

      const res = await fetch('http://localhost:5000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          userContext: userContext
        })
      });

      const data = await res.json();
      const replyText = data.reply || data.data?.reply || data.message || t('ai_offline');

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText
        }
      ]);
    } catch (err) {
      console.error("AI Chatbot request error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: t('ai_offline')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "Hello! I am your EduSynk AI Learning Assistant. Ask me anything about finding exchange partners, match synergy, or skill roadmaps!"
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className="ai-chat-floating-btn"
          onClick={() => setIsOpen(true)}
          title={t('btn_ask_ai')}
        >
          <Bot size={24} />
          <span className="ai-btn-pulse" />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="ai-chat-window glass-panel">
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="ai-header-title">{t('ai_title')}</h4>
                <p className="ai-header-status">
                  <span className="status-dot online" /> {t('ai_subtitle')}
                </p>
              </div>
            </div>

            <div className="ai-header-actions">
              <button className="icon-btn-sm" onClick={handleClear} title="Clear Chat">
                <RefreshCw size={14} />
              </button>
              <button className="icon-btn-sm" onClick={() => setIsOpen(false)} title="Close Chat">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="ai-chat-body">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`ai-message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="ai-msg-avatar">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className="ai-msg-content">{msg.text}</div>
              </div>
            ))}

            {isLoading && (
              <div className="ai-message-bubble ai-bubble loading-bubble">
                <div className="ai-msg-avatar">
                  <Bot size={14} className="spin-anim" />
                </div>
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="ai-suggestions-container">
              <p className="suggestions-label">Suggested Questions:</p>
              <div className="suggestions-chips">
                <button className="chip-btn" onClick={() => handleSend(t('ai_suggested_1'))}>
                  {t('ai_suggested_1')}
                </button>
                <button className="chip-btn" onClick={() => handleSend(t('ai_suggested_2'))}>
                  {t('ai_suggested_2')}
                </button>
                <button className="chip-btn" onClick={() => handleSend(t('ai_suggested_3'))}>
                  {t('ai_suggested_3')}
                </button>
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="ai-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="ai-chat-input"
              placeholder={t('ai_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-chat-send-btn gradient-btn"
              disabled={!input.trim() || isLoading}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
