import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Repeat, 
  Calendar,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    currentUser, 
    students, 
    skills, 
    exchanges, 
    calculateSynergyScore, 
    setActiveTab,
    setActiveExchangeId,
    acceptExchangeRequest,
    declineExchangeRequest
  } = useApp();

  if (!currentUser) return null;

  const activeUserId = currentUser?.userId || currentUser?.id;

  // Filter exchanges involving current user
  const userExchanges = exchanges.filter(ex => 
    ex.requesterId === activeUserId || ex.recipientId === activeUserId
  );

  const activeExchanges = userExchanges.filter(ex => ex.status === 'Active');
  const pendingIncoming = userExchanges.filter(ex => ex.recipientId === activeUserId && ex.status === 'Pending');
  const pendingOutgoing = userExchanges.filter(ex => ex.requesterId === activeUserId && ex.status === 'Pending');

  // Top recommendations (students with highest synergy score)
  const otherStudents = students.filter(s => (s.userId || s.id) !== activeUserId);
  const synergyMatches = otherStudents.map(student => ({
    student,
    synergy: calculateSynergyScore(currentUser, student)
  })).sort((a, b) => b.synergy.score - a.synergy.score);

  const topMatch = synergyMatches[0];

  const getSkillName = (id) => skills.find(s => s.id === id || s.skillId === id)?.name || id;
  const getStudent = (id) => students.find(s => s.id === id || s.userId === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* Hero Welcome Header */}
      <div className="card glass-panel" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '30px 28px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.1) 100%)',
        borderColor: 'var(--border-glow)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back, {currentUser.name}!</h1>
                <span className="badge badge-synergy">
                  <ShieldCheck size={14} /> {currentUser.verifiedBadge}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
                {currentUser.university} • {currentUser.major}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setActiveTab('matcher')} className="btn btn-primary">
              <Sparkles size={18} /> Synergy Match Engine
            </button>
            <button onClick={() => setActiveTab('skills')} className="btn btn-secondary">
              <BookOpen size={18} /> Discover Skills
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Repeat size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeExchanges.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Exchanges</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={22} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentUser.teachSkills?.length || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skills You Teach</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentUser.learnSkills?.length || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Learning Goals</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentUser.reputationScore}/100</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Trust Rating</div>
          </div>
        </div>
      </div>

      {/* Main Action Section: "What Should I Do Next?" */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        
        {/* Left Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Action Required Box */}
          <div className="card" style={{ borderColor: pendingIncoming.length > 0 ? 'var(--accent-amber)' : 'var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={20} color="var(--accent-amber)" />
                <h2 style={{ fontSize: '1.2rem' }}>What Should You Do Next?</h2>
              </div>
              <span className="badge badge-amber">{pendingIncoming.length} Action Needed</span>
            </div>

            {pendingIncoming.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pendingIncoming.map(ex => {
                  const requester = getStudent(ex.requesterId);
                  return (
                    <div 
                      key={ex.id} 
                      className="card glass-panel"
                      style={{ padding: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={requester?.avatar} alt={requester?.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                            {requester?.name} proposed a Skill Exchange
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Teaches: <strong>{getSkillName(ex.offeredSkillId)}</strong> ↔ Wants: <strong>{getSkillName(ex.requestedSkillId)}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => acceptExchangeRequest(ex.id)} className="btn btn-primary btn-sm">
                          Accept Exchange
                        </button>
                        <button onClick={() => declineExchangeRequest(ex.id)} className="btn btn-secondary btn-sm">
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : activeExchanges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeExchanges.map(ex => {
                  const partnerId = ex.requesterId === activeUserId ? ex.recipientId : ex.requesterId;
                  const partner = getStudent(partnerId);
                  const incompleteTask = ex.milestones?.find(m => !m.completed);

                  return (
                    <div key={ex.id} className="card glass-panel" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={partner?.avatar} alt={partner?.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Active Exchange with {partner?.name}</span>
                            <span className="badge badge-Active" style={{ marginLeft: 8 }}>Active</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveExchangeId(ex.id);
                            setActiveTab('exchanges');
                          }} 
                          className="btn btn-outline btn-sm"
                        >
                          <MessageSquare size={14} /> Open Workspace
                        </button>
                      </div>

                      {incompleteTask ? (
                        <div style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={16} color="var(--accent-cyan)" />
                          <span>Next Goal: <strong>{incompleteTask.title}</strong></span>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={16} /> All current milestone tasks completed! Ready to finish exchange.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)' }}>
                <p>No active exchange action items right now. Discover compatible students below!</p>
                <button onClick={() => setActiveTab('students')} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  <Users size={16} /> Find Peer Matches
                </button>
              </div>
            )}
          </div>

          {/* Featured Mutual Synergy Match */}
          {topMatch && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={20} color="#10b981" />
                  <h3 style={{ fontSize: '1.1rem' }}>Top 100% Synergy Match for You</h3>
                </div>
                <span className="badge badge-synergy">
                  {topMatch.synergy.score}% Mutual Fit
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <img src={topMatch.student.avatar} alt={topMatch.student.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{topMatch.student.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {topMatch.student.university} • {topMatch.student.major}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: '0.85rem' }}>
                <div style={{ marginBottom: 4 }}>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Teaches what you need:</strong> {topMatch.student.teachSkills.map(ts => getSkillName(ts.skillId)).join(', ')}
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-primary)' }}>Wants what you teach:</strong> {topMatch.student.learnSkills.map(ls => getSkillName(ls.skillId)).join(', ')}
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('students')}
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
              >
                View Full Synergy Rationale & Request Exchange <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Quick Learning Goals Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="var(--accent-purple)" />
              Your Skill Goals
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentUser.learnSkills?.map(ls => (
                <div key={ls.skillId} style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{getSkillName(ls.skillId)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Goal: {ls.targetGoal}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Trust Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="var(--accent-amber)" />
              Peer Trust System
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Your trust rating is built through verified exchange completions and peer feedback. No self-rating or cash transactions.
            </p>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 600 }}>
              ✓ Zero Spam Rating Guard Active
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
