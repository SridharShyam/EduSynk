import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SkillCatalog } from './components/SkillCatalog';
import { StudentFinder } from './components/StudentFinder';
import { MatchEngineView } from './components/MatchEngineView';
import { ExchangeManager } from './components/ExchangeManager';
import { ExchangeWorkspace } from './components/ExchangeWorkspace';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AIChatWidget } from './components/AIChatWidget';
import { Zap, Heart } from 'lucide-react';

export const AppContent = () => {
  const { activeTab, activeExchangeId } = useApp();
  const [isAiChatOpen, setIsAiChatOpen] = React.useState(false);

  const renderActiveTab = () => {
    if (activeExchangeId && activeTab === 'exchanges') {
      return <ExchangeWorkspace />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'skills':
        return <SkillCatalog />;
      case 'students':
        return <StudentFinder />;
      case 'matcher':
        return <MatchEngineView />;
      case 'exchanges':
        return <ExchangeManager />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {renderActiveTab()}
      </main>
      <ToastContainer />
      <AIChatWidget isOpen={isAiChatOpen} setIsOpen={setIsAiChatOpen} />
      <MobileBottomNav onOpenAiChat={() => setIsAiChatOpen(true)} />

      {/* Modern Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px 20px', background: 'var(--bg-secondary)', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="var(--accent-primary)" />
            <strong style={{ color: 'var(--text-primary)' }}>SkillNexus</strong> — Peer-to-Peer Student Skill Exchange Platform
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Designed for genuine peer learning & reciprocal growth
          </div>
        </div>
      </footer>
    </div>
  );
};

