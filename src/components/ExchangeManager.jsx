import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EXCHANGE_STATUS } from '../types';
import { 
  Repeat, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  MessageSquare, 
  Star, 
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';

export const ExchangeManager = () => {
  const { 
    currentUser, 
    students, 
    skills, 
    exchanges, 
    acceptExchangeRequest, 
    declineExchangeRequest, 
    cancelExchange,
    pauseExchange,
    completeExchange,
    submitFeedback,
    setActiveExchangeId
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('All');
  const [feedbackModalExchange, setFeedbackModalExchange] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const getSkillName = (id) => skills.find(s => s.id === id || s.skillId === id)?.name || id;
  const getStudent = (id) => students.find(s => s.id === id || s.userId === id);

  const activeUserId = currentUser?.userId || currentUser?.id;

  // Filter user's exchanges
  const userExchanges = exchanges.filter(ex => 
    ex.requesterId === activeUserId || ex.recipientId === activeUserId
  );

  const filteredExchanges = userExchanges.filter(ex => {
    if (filterStatus === 'All') return true;
    return ex.status === filterStatus;
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackModalExchange) return;
    submitFeedback(feedbackModalExchange.id, rating, comment);
    setFeedbackModalExchange(null);
    setComment('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Repeat size={28} className="gradient-text" /> My Skill Exchanges
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
          Manage your pending proposals, active learning workspaces, and completed peer exchange reviews.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['All', ...Object.values(EXCHANGE_STATUS)].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Exchanges List */}
      {filteredExchanges.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {filteredExchanges.map(ex => {
            const isRequester = ex.requesterId === activeUserId;
            const partnerId = isRequester ? ex.recipientId : ex.requesterId;
            const partner = getStudent(partnerId);

            return (
              <div key={ex.id} className="card card-hover" style={{ padding: 22 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={partner?.avatar} alt={partner?.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        Skill Exchange with {partner?.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {partner?.university} • {partner?.major}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className={`badge badge-status badge-${ex.status}`}>
                      {ex.status}
                    </span>
                  </div>
                </div>

                {/* Reciprocal Terms Box */}
                <div style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: '0.88rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
                    <div>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Offered Skill:</span>{' '}
                      <strong>{getSkillName(ex.offeredSkillId)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>Requested Skill:</span>{' '}
                      <strong>{getSkillName(ex.requestedSkillId)}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong>Agreement Terms:</strong> "{ex.reciprocalAgreement}"
                  </div>
                </div>

                {/* Action Toolbar by State */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                  
                  {/* Status Info */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> Created: {new Date(ex.createdAt).toLocaleDateString()} • {ex.format}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    
                    {/* PENDING STATE */}
                    {ex.status === EXCHANGE_STATUS.PENDING && (
                      !isRequester ? (
                        <>
                          <button onClick={() => acceptExchangeRequest(ex.id)} className="btn btn-primary btn-sm">
                            <CheckCircle2 size={16} /> Accept Request
                          </button>
                          <button onClick={() => declineExchangeRequest(ex.id)} className="btn btn-secondary btn-sm">
                            <XCircle size={16} /> Decline
                          </button>
                        </>
                      ) : (
                        <button onClick={() => cancelExchange(ex.id)} className="btn btn-secondary btn-sm">
                          Cancel Request
                        </button>
                      )
                    )}

                    {/* ACTIVE STATE */}
                    {ex.status === EXCHANGE_STATUS.ACTIVE && (
                      <>
                        <button 
                          onClick={() => setActiveExchangeId(ex.id)}
                          className="btn btn-primary btn-sm"
                        >
                          <MessageSquare size={16} /> Enter Exchange Workspace
                        </button>

                        <button onClick={() => pauseExchange(ex.id)} className="btn btn-secondary btn-sm" title="Pause session">
                          <Pause size={16} /> Pause
                        </button>

                        <button onClick={() => completeExchange(ex.id)} className="btn btn-outline btn-sm">
                          <CheckCircle2 size={16} /> Mark Completed
                        </button>
                      </>
                    )}

                    {/* PAUSED STATE */}
                    {ex.status === EXCHANGE_STATUS.PAUSED && (
                      <button onClick={() => pauseExchange(ex.id)} className="btn btn-primary btn-sm">
                        <Play size={16} /> Resume Exchange
                      </button>
                    )}

                    {/* COMPLETED STATE */}
                    {ex.status === EXCHANGE_STATUS.COMPLETED && (
                      <button 
                        onClick={() => setFeedbackModalExchange(ex)}
                        className="btn btn-primary btn-sm"
                      >
                        <Star size={16} /> Leave Peer Feedback
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.05rem' }}>No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} exchanges found.</p>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalExchange && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>Submit Verified Peer Feedback</h2>
              <button onClick={() => setFeedbackModalExchange(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              <div className="input-group">
                <label className="input-label">Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ padding: 4 }}
                    >
                      <Star size={26} color={star <= rating ? '#f59e0b' : 'var(--text-muted)'} fill={star <= rating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Peer Review & Testimonial</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe how the session went, what you learned, and rate their teaching clarity..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="textarea-field"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setFeedbackModalExchange(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
