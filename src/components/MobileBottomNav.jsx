import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, BookOpen, Users, Zap, RefreshCw, Bot } from 'lucide-react';

export const MobileBottomNav = ({ onOpenAiChat }) => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'skills', label: t('nav_skills'), icon: BookOpen },
    { id: 'students', label: t('nav_students'), icon: Users },
    { id: 'synergy', label: t('nav_synergy'), icon: Zap },
    { id: 'exchanges', label: t('nav_exchanges'), icon: RefreshCw }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-container">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
        <button
          className="mobile-nav-btn ai-highlight"
          onClick={onOpenAiChat}
          title="Open AI Assistant"
        >
          <Bot size={20} />
          <span className="mobile-nav-label">AI</span>
        </button>
      </div>
    </nav>
  );
};
