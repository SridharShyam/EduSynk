import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { 
  Sparkles, 
  Compass, 
  Users, 
  Repeat, 
  UserCheck, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown,
  RotateCcw,
  LayoutDashboard,
  Zap,
  Globe,
  LogIn
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    currentUserId, 
    setCurrentUserId, 
    students, 
    exchanges, 
    theme, 
    setTheme, 
    language,
    setLanguage,
    t,
    activeTab, 
    setActiveTab,
    logout,
    resetDemoData
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);


  // Calculate pending requests count for active user
  const activeId = currentUser?.userId || currentUser?.id;
  const pendingRequestsCount = exchanges.filter(ex => 
    ex.recipientId === activeId && ex.status === 'Pending'
  ).length;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 90, borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabChange('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{ 
            width: 38, 
            height: 38, 
            borderRadius: 'var(--radius-md)', 
            background: 'var(--gradient-brand)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
              SkillNexus
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: -3, letterSpacing: '0.05em' }}>
              STUDENT SKILL EXCHANGE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            onClick={() => handleTabChange('dashboard')} 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <LayoutDashboard size={16} />
            <span>{t('nav_dashboard')}</span>
          </button>

          <button 
            onClick={() => handleTabChange('skills')} 
            className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <Compass size={16} />
            <span>{t('nav_skills')}</span>
          </button>

          <button 
            onClick={() => handleTabChange('students')} 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <Users size={16} />
            <span>{t('nav_students')}</span>
          </button>

          <button 
            onClick={() => handleTabChange('matcher')} 
            className={`btn ${activeTab === 'matcher' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
          >
            <Sparkles size={16} />
            <span>{t('nav_synergy')}</span>
          </button>

          <button 
            onClick={() => handleTabChange('exchanges')} 
            className={`btn ${activeTab === 'exchanges' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 14px', fontSize: '0.88rem', position: 'relative' }}
          >
            <Repeat size={16} />
            <span>{t('nav_exchanges')}</span>
            {pendingRequestsCount > 0 && (
              <span className="badge badge-amber" style={{ position: 'absolute', top: -6, right: -6, padding: '2px 6px', fontSize: '0.68rem' }}>
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {currentUserId === 'admin' && (
            <button 
              onClick={() => handleTabChange('admin')} 
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            >
              <ShieldAlert size={16} />
              <span>{t('nav_admin')}</span>
            </button>
          )}
        </div>


        {/* Right Action Controls: Persona Switcher & Theme & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          
          {/* Persona Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
              className="card"
              style={{ 
                padding: '6px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
                borderColor: 'var(--accent-primary)',
                boxShadow: 'var(--shadow-glow)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              title="Click to switch active test user persona"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }} 
              />
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {currentUserId === 'admin' ? 'Platform Admin' : 'Switch Persona'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
            </button>


            {personaDropdownOpen && (
              <div 
                className="card glass-panel"
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 270,
                  padding: 8,
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Switch Active Persona:
                </div>
                {students.map(student => {
                  const sId = student.userId || student.id;
                  const isSelected = sId === currentUserId;
                  return (
                    <button
                      key={sId}
                      onClick={() => {
                        setCurrentUserId(sId);
                        setPersonaDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                        textAlign: 'left',
                        marginBottom: 4,
                        cursor: 'pointer'
                      }}
                    >
                      <img src={student.avatar} alt={student.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {student.name} {isSelected ? '✓' : ''}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {student.major}
                        </div>
                      </div>
                    </button>
                  );
                })}
                
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />
                
                <button
                  onClick={() => {
                    setCurrentUserId('admin');
                    setPersonaDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderRadius: 'var(--radius-md)',
                    background: currentUserId === 'admin' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    border: currentUserId === 'admin' ? '1px solid var(--accent-purple)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldAlert size={20} color="var(--accent-purple)" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                      System Admin Mode {currentUserId === 'admin' ? '✓' : ''}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Safety & Skill Moderation</div>
                  </div>
                </button>
              </div>
            )}
          </div>



          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            title="Toggle Light / Dark Mode"
            style={{ borderRadius: '50%' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>


          {/* Sign In / JWT Auth Button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn-primary"
            title="Sign In or Create Account"
            style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-full)' }}
          >
            <LogIn size={15} />
            <span>Auth</span>
          </button>

          {/* Reset Demo Data Button */}
          <button 
            onClick={resetDemoData} 
            className="btn-icon" 
            title="Reset All Mock Data to Default"
            style={{ borderRadius: '50%' }}
          >
            <RotateCcw size={16} />
          </button>

          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn-icon mobile-only"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => handleTabChange('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => handleTabChange('skills')} className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
            <Compass size={18} /> Discover Skills
          </button>
          <button onClick={() => handleTabChange('students')} className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
            <Users size={18} /> Find Students
          </button>
          <button onClick={() => handleTabChange('matcher')} className={`btn ${activeTab === 'matcher' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
            <Sparkles size={18} /> Synergy Engine
          </button>
          <button onClick={() => handleTabChange('exchanges')} className={`btn ${activeTab === 'exchanges' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
            <Repeat size={18} /> My Exchanges ({pendingRequestsCount} pending)
          </button>
          {currentUserId === 'admin' && (
            <button onClick={() => handleTabChange('admin')} className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`} style={{ justify: 'flex-start' }}>
              <ShieldAlert size={18} /> Admin Console
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
