import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  Plus, 
  Send, 
  ShieldAlert, 
  ArrowLeft, 
  BookOpen, 
  MessageSquare,
  FileText,
  X
} from 'lucide-react';

export const ExchangeWorkspace = () => {
  const { 
    currentUser, 
    students, 
    skills, 
    exchanges, 
    messages, 
    activeExchangeId, 
    setActiveExchangeId, 
    toggleMilestone, 
    addMilestone, 
    addSessionLog, 
    sendMessage,
    submitSafetyReport
  } = useApp();

  const [workspaceTab, setWorkspaceTab] = useState('milestones'); // 'milestones' | 'sessions' | 'chat'
  
  // Forms state
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionVideo, setSessionVideo] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Unresponsive after scheduling session');
  const [reportDetails, setReportDetails] = useState('');

  const exchange = exchanges.find(ex => ex.id === activeExchangeId) || exchanges[0];
  if (!exchange) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p>No active exchange selected.</p>
        <button onClick={() => setActiveExchangeId(null)} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
          Back to Exchanges
        </button>
      </div>
    );
  }

  const currentId = currentUser.userId || currentUser.id;
  const partnerId = exchange.requesterId === currentId ? exchange.recipientId : exchange.requesterId;
  const partner = students.find(s => s.id === partnerId || s.userId === partnerId);
  const offeredSkill = skills.find(s => s.id === exchange.offeredSkillId || s.skillId === exchange.offeredSkillId);
  const requestedSkill = skills.find(s => s.id === exchange.requestedSkillId || s.skillId === exchange.requestedSkillId);

  const exchangeMessages = messages.filter(m => m.exchangeId === exchange.id || m.exchangeId === exchange.exchangeId);

  const handleAddMilestoneSubmit = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(exchange.id, newMilestoneTitle.trim());
    setNewMilestoneTitle('');
  };

  const handleAddSessionSubmit = (e) => {
    e.preventDefault();
    if (!sessionTopic.trim()) return;
    addSessionLog(exchange.id, {
      date: new Date().toISOString().split('T')[0],
      topic: sessionTopic.trim(),
      notes: sessionNotes.trim(),
      videoLink: sessionVideo.trim()
    });
    setSessionTopic('');
    setSessionNotes('');
    setSessionVideo('');
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(exchange.id, chatInput.trim());
    setChatInput('');
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    submitSafetyReport({
      reportedUserId: partner.id,
      reason: reportReason,
      details: reportDetails
    });
    setReportModalOpen(false);
    setReportDetails('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setActiveExchangeId(null)} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Exchanges List
        </button>

        <button 
          onClick={() => setReportModalOpen(true)} 
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--accent-rose)' }}
        >
          <ShieldAlert size={16} /> Report Safety / Issue
        </button>
      </div>

      {/* Exchange Summary Banner */}
      <div className="card glass-panel" style={{ padding: 20, borderColor: 'var(--border-glow)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={partner?.avatar} alt={partner?.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Workspace: {partner?.name} & {currentUser.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Exchanging: <strong style={{ color: 'var(--accent-emerald)' }}>{offeredSkill?.name}</strong> ↔ <strong style={{ color: 'var(--accent-purple)' }}>{requestedSkill?.name}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a 
              href={`https://meet.jit.si/skillnexus-${exchange.id}`} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              <Video size={16} /> Launch Video Session
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: 12 }}>
        <button
          onClick={() => setWorkspaceTab('milestones')}
          className={`btn ${workspaceTab === 'milestones' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          <CheckCircle2 size={16} /> Shared Milestone Checklist ({exchange.milestones?.filter(m => m.completed).length || 0}/{exchange.milestones?.length || 0})
        </button>

        <button
          onClick={() => setWorkspaceTab('sessions')}
          className={`btn ${workspaceTab === 'sessions' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          <Calendar size={16} /> Session Logs ({exchange.sessionLogs?.length || 0})
        </button>

        <button
          onClick={() => setWorkspaceTab('chat')}
          className={`btn ${workspaceTab === 'chat' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          <MessageSquare size={16} /> Peer Chat & Notes ({exchangeMessages.length})
        </button>
      </div>

      {/* TAB 1: Shared Milestones */}
      {workspaceTab === 'milestones' && (
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: 14 }}>Reciprocal Milestone Tasks</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {exchange.milestones?.map(m => (
              <div 
                key={m.id} 
                onClick={() => toggleMilestone(exchange.id, m.id)}
                style={{ 
                  background: m.completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)', 
                  padding: 14, 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  cursor: 'pointer',
                  border: m.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)'
                }}
              >
                <CheckCircle2 size={20} color={m.completed ? '#10b981' : 'var(--text-muted)'} />
                <span style={{ flex: 1, textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: 600 }}>
                  {m.title}
                </span>
                {m.date && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Done {m.date}</span>}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddMilestoneSubmit} style={{ display: 'flex', gap: 10 }}>
            <input 
              type="text" 
              placeholder="Add a new joint learning milestone..." 
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              className="input-field"
              style={{ height: 42 }}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Milestone Goal
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Session Logs */}
      {workspaceTab === 'sessions' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: 14 }}>Log Completed Session</h2>
            <form onSubmit={handleAddSessionSubmit}>
              <div className="input-group">
                <label className="input-label">Session Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Figma Auto-Layout Fundamentals" 
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Key Notes / Outcomes</label>
                <textarea 
                  rows="3" 
                  placeholder="Summary of what was covered, exercises solved..." 
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="textarea-field"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Save Session Log
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: 14 }}>Past Session History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {exchange.sessionLogs?.map(log => (
                <div key={log.id} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>{log.date}</span>
                    <a href={log.videoLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                      Video Meeting Log
                    </a>
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>{log.topic}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{log.notes}</p>
                </div>
              ))}

              {(!exchange.sessionLogs || exchange.sessionLogs.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No sessions logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Peer Chat */}
      {workspaceTab === 'chat' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 420 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 6 }}>
            {exchangeMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              const sender = students.find(s => s.id === msg.senderId);

              return (
                <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2, textAlign: isMe ? 'right' : 'left' }}>
                    {sender?.name} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{
                    background: isMe ? 'var(--gradient-brand)' : 'var(--bg-tertiary)',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '0.88rem',
                    lineHeight: 1.4
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {exchangeMessages.length === 0 && (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No messages yet. Send a message to coordinate your next session!
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <input 
              type="text" 
              placeholder="Type a message to your exchange partner..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      )}

      {/* Safety Report Modal */}
      {reportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-rose)' }}>Report Safety Issue or Unresponsiveness</h2>
              <button onClick={() => setReportModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit}>
              <div className="input-group">
                <label className="input-label">Reason</label>
                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="select-field">
                  <option value="Unresponsive after scheduling session">Unresponsive after scheduling session</option>
                  <option value="Inappropriate communication">Inappropriate communication</option>
                  <option value="False expertise claim">False expertise claim</option>
                  <option value="Commercial advertising or solicitation">Commercial advertising or solicitation</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Details</label>
                <textarea 
                  rows="3" 
                  placeholder="Provide brief context for platform moderators..." 
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="textarea-field"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" onClick={() => setReportModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-rose)' }}>
                  Submit Safety Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
