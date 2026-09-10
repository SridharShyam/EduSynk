import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABILITY_OPTIONS, LEARNING_FORMATS, SKILL_LEVELS } from '../types';
import { 
  User, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Calendar, 
  Globe, 
  Edit3, 
  Save, 
  X, 
  Star,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const ProfileView = () => {
  const { currentUser, skills, exchanges, updateCurrentUserProfile } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [university, setUniversity] = useState(currentUser.university || '');
  const [major, setMajor] = useState(currentUser.major || '');
  const [availability, setAvailability] = useState(currentUser.availability || AVAILABILITY_OPTIONS[0]);
  const [preferredFormat, setPreferredFormat] = useState(currentUser.preferredFormat || Object.values(LEARNING_FORMATS)[0]);

  const getSkillName = (id) => skills.find(s => s.id === id || s.skillId === id)?.name || id;

  const activeUserId = currentUser?.userId || currentUser?.id;

  // Gather peer feedback received
  const completedExchangesWithFeedback = exchanges.filter(ex => 
    (ex.requesterId === activeUserId || ex.recipientId === activeUserId) &&
    ex.status === 'Completed' &&
    ex.feedback
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCurrentUserProfile({
      bio,
      university,
      major,
      availability,
      preferredFormat
    });
    setEditMode(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={28} className="gradient-text" /> Student Credibility Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
            Manage your skill credentials, learning goals, schedule availability, and peer reputation badges.
          </p>
        </div>

        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="btn btn-secondary">
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <button onClick={() => setEditMode(false)} className="btn btn-secondary">
            <X size={16} /> Cancel Editing
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="card glass-panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }} 
          />

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentUser.name}</h2>
              <span className="badge badge-synergy">
                <ShieldCheck size={14} /> {currentUser.verifiedBadge}
              </span>
            </div>

            {!editMode ? (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
                  {currentUser.university} • {currentUser.major}
                </p>
                <p style={{ marginTop: 12, fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  "{currentUser.bio}"
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={16} color="var(--accent-amber)" /> Availability: <strong>{currentUser.availability}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Globe size={16} color="var(--accent-cyan)" /> Preferred Format: <strong>{currentUser.preferredFormat}</strong>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label className="input-label">University</label>
                    <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="input-field" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Major & Year</label>
                    <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} className="input-field" required />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Short Bio</label>
                  <textarea rows="3" value={bio} onChange={(e) => setBio(e.target.value)} className="textarea-field" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label className="input-label">Availability</label>
                    <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="select-field">
                      {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Preferred Format</label>
                    <select value={preferredFormat} onChange={(e) => setPreferredFormat(e.target.value)} className="select-field">
                      {Object.values(LEARNING_FORMATS).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Save size={16} /> Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* Skills Offered */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: 14, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} /> Skills You Can Teach
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentUser.teachSkills?.map(ts => (
              <div key={ts.skillId} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{getSkillName(ts.skillId)}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ts.notes}</div>
                </div>
                <span className="badge badge-synergy">{ts.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Wanting to Learn */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: 14, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={20} /> Skills You Want to Learn
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentUser.learnSkills?.map(ls => (
              <div key={ls.skillId} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{getSkillName(ls.skillId)}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target: {ls.targetGoal}</div>
                </div>
                <span className="badge badge-amber">{ls.level}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Peer Feedback & Credibility Feed */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Star size={20} color="var(--accent-amber)" /> Verified Peer Reviews & Testimonials ({completedExchangesWithFeedback.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {completedExchangesWithFeedback.map(ex => {
            const isUser1 = ex.requesterId === activeUserId;
            const rating = isUser1 ? ex.feedback.user2Rating : ex.feedback.user1Rating;
            const comment = isUser1 ? ex.feedback.user2Comment : ex.feedback.user1Comment;

            if (!comment) return null;

            return (
              <div key={ex.id} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} color={s <= rating ? '#f59e0b' : 'var(--text-muted)'} fill={s <= rating ? '#f59e0b' : 'none'} />
                    ))}
                  </div>
                  <span className="badge badge-synergy" style={{ fontSize: '0.68rem' }}>Verified Exchange Review</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{comment}"
                </p>
              </div>
            );
          })}

          {completedExchangesWithFeedback.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No peer reviews submitted yet. Complete an exchange to receive verified feedback!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
