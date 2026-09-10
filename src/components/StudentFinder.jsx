import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABILITY_OPTIONS, LEARNING_FORMATS } from '../types';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Repeat, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Send,
  Info,
  Calendar,
  Video,
  Loader2
} from 'lucide-react';

export const StudentFinder = () => {
  const { 
    currentUser, 
    students, 
    skills, 
    calculateSynergyScore, 
    sendExchangeRequest,
    setActiveTab,
    setActiveExchangeId,
    language,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [onlyMutualMatches, setOnlyMutualMatches] = useState(false);
  const [isSearchingBackend, setIsSearchingBackend] = useState(false);
  const [backendSearchResults, setBackendSearchResults] = useState(null);

  // Debounce search query input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query backend search API on debounced query change
  useEffect(() => {
    const triggerBackendSearch = async () => {
      if (!debouncedQuery.trim()) {
        setBackendSearchResults(null);
        return;
      }

      setIsSearchingBackend(true);
      try {
        const res = await fetch(`http://localhost:5000/api/v1/search?q=${encodeURIComponent(debouncedQuery)}&format=${encodeURIComponent(selectedFormat)}`);
        const json = await res.json();

        if (json.data && json.data.results) {
          setBackendSearchResults(json.data.results);
        } else {
          setBackendSearchResults(null);
        }
      } catch (err) {
        console.error("Backend search failed:", err);
        setBackendSearchResults(null);
      } finally {
        setIsSearchingBackend(false);
      }
    };

    triggerBackendSearch();
  }, [debouncedQuery, selectedFormat]);


  // Modals
  const [proposalModalStudent, setProposalModalStudent] = useState(null);
  const [rationaleModalStudent, setRationaleModalStudent] = useState(null);

  // Proposal Form State
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [proposedFormat, setProposedFormat] = useState('');
  const [proposedHours, setProposedHours] = useState(2);
  const [agreementText, setAgreementText] = useState('');

  const getSkillName = (id) => {
    const found = skills.find(s => s.id === id || s.skillId === id);
    return found ? found.name : id;
  };

  const getSkillObject = (id) => skills.find(s => s.id === id || s.skillId === id);

  const activeUserId = currentUser?.userId || currentUser?.id;

  // Filter students (client or backend merged)
  const sourceStudents = backendSearchResults || students;

  const filteredStudents = sourceStudents.filter(student => {
    const sId = student.userId || student.id;
    if (sId === activeUserId) return false;

    const q = searchQuery.toLowerCase().trim();

    // If using backend search results, query matching is already handled on MongoDB backend
    let matchesSearch = true;
    if (!backendSearchResults) {
      const matchesName = student.name?.toLowerCase().includes(q);
      const matchesUni = student.university?.toLowerCase().includes(q);
      const matchesMajor = student.major?.toLowerCase().includes(q);
      const matchesBio = student.bio?.toLowerCase().includes(q);

      const matchesTeach = student.teachSkills?.some(ts => {
        const sObj = getSkillObject(ts.skillId);
        const nameMatch = sObj?.name?.toLowerCase().includes(q) || ts.skillId?.toLowerCase().includes(q);
        const catMatch = sObj?.category?.toLowerCase().includes(q);
        const tagMatch = sObj?.tags?.some(t => t.toLowerCase().includes(q));
        return nameMatch || catMatch || tagMatch;
      });

      const matchesLearn = student.learnSkills?.some(ls => {
        const sObj = getSkillObject(ls.skillId);
        const nameMatch = sObj?.name?.toLowerCase().includes(q) || ls.skillId?.toLowerCase().includes(q);
        const catMatch = sObj?.category?.toLowerCase().includes(q);
        const tagMatch = sObj?.tags?.some(t => t.toLowerCase().includes(q));
        return nameMatch || catMatch || tagMatch;
      });

      matchesSearch = !q || matchesName || matchesUni || matchesMajor || matchesBio || matchesTeach || matchesLearn;
    }

    const matchesFormat = selectedFormat === 'All' || student.preferredFormat === selectedFormat;
    const matchesAvailability = selectedAvailability === 'All' || student.availability === selectedAvailability;

    const synergy = calculateSynergyScore(currentUser, student);
    const matchesMutual = !onlyMutualMatches || synergy.isMutual;

    return matchesSearch && matchesFormat && matchesAvailability && matchesMutual;
  });

  const openProposalModal = (student) => {
    setProposalModalStudent(student);
    const defaultOffer = currentUser.teachSkills?.[0]?.skillId || '';
    const defaultRequest = student.teachSkills?.[0]?.skillId || '';
    setOfferedSkillId(defaultOffer);
    setRequestedSkillId(defaultRequest);
    setProposedFormat(student.preferredFormat || currentUser.preferredFormat);
    setProposedHours(2);
    setAgreementText(`I'll teach 2 hours of ${getSkillName(defaultOffer)} in exchange for 2 hours of ${getSkillName(defaultRequest)}.`);
  };

  const handleProposalSubmit = (e) => {
    e.preventDefault();
    if (!proposalModalStudent || !offeredSkillId || !requestedSkillId) return;

    const success = sendExchangeRequest({
      recipientId: proposalModalStudent.id || proposalModalStudent.userId,
      offeredSkillId,
      requestedSkillId,
      format: proposedFormat,
      proposedHoursPerWeek: proposedHours,
      reciprocalAgreement: agreementText
    });

    if (success) {
      setProposalModalStudent(null);
      setActiveTab('exchanges');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={28} className="gradient-text" /> {t('title_find_students')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
          {t('subtitle_find_students')}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          {isSearchingBackend ? (
            <Loader2 size={18} className="spin-anim" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
          ) : (
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          )}
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 42, height: 44 }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('learning_format')}:</span>
            <select 
              value={selectedFormat} 
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="select-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <option value="All">{t('all_formats')}</option>
              {Object.values(LEARNING_FORMATS).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Availability:</span>
            <select 
              value={selectedAvailability} 
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="select-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <option value="All">All Schedules</option>
              {AVAILABILITY_OPTIONS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <input 
              type="checkbox" 
              checked={onlyMutualMatches}
              onChange={(e) => setOnlyMutualMatches(e.target.checked)}
              style={{ accentColor: 'var(--accent-emerald)' }}
            />
            <span style={{ color: 'var(--accent-emerald)' }}>{t('reciprocal_match')}</span>
          </label>
        </div>
      </div>


      {/* Student Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {filteredStudents.map(student => {
            const synergy = calculateSynergyScore(currentUser, student);

            return (
              <div key={student.id || student.userId} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Top Banner & Synergy Score Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={student.avatar} alt={student.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{student.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.university}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{student.major}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setRationaleModalStudent(student)}
                      className="badge badge-synergy"
                      style={{ cursor: 'pointer' }}
                      title="Click to view Synergy Score breakdown"
                    >
                      <Sparkles size={12} /> {synergy.score}% Synergy
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 16 }}>
                    "{student.bio}"
                  </p>

                  {/* Skills Teaches / Learns */}
                  <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                        Can Teach:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {student.teachSkills?.map(ts => (
                          <span key={ts.skillId} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            {getSkillName(ts.skillId)} ({ts.level})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                        Wants to Learn:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {student.learnSkills?.map(ls => (
                          <span key={ls.skillId} className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                            {getSkillName(ls.skillId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Format & Trust Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={14} /> {student.availability}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={14} color="var(--accent-emerald)" /> {student.reputationScore}/100 Trust
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    onClick={() => openProposalModal(student)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Send size={14} /> Request Exchange
                  </button>
                  <button 
                    onClick={() => setRationaleModalStudent(student)}
                    className="btn btn-secondary btn-sm"
                    title="View Synergy Rationale"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
            No matching student peers found{searchQuery ? ` for "${searchQuery}"` : ''}.
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
            Try clearing search keywords, adjusting format/availability filters, or unticking 100% 2-Way Swaps.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedFormat('All');
              setSelectedAvailability('All');
              setOnlyMutualMatches(false);
            }} 
            className="btn btn-secondary btn-sm" 
            style={{ marginTop: 16 }}
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* Rationale Drawer Modal */}
      {rationaleModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <span className="badge badge-synergy">Explainable Synergy Rationale</span>
                <h2 style={{ fontSize: '1.3rem', marginTop: 4 }}>
                  Compatibility: {currentUser.name} & {rationaleModalStudent.name}
                </h2>
              </div>
              <button onClick={() => setRationaleModalStudent(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {(() => {
              const synergy = calculateSynergyScore(currentUser, rationaleModalStudent);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: 20, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-synergy-text">
                      {synergy.score}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {synergy.isMutual ? '100% Direct Reciprocal Skill Swap!' : 'High Synergy Match'}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1rem' }}>Score Breakdown Rationale:</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {synergy.breakdown.map((item, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
                          <CheckCircle2 size={16} color="var(--accent-emerald)" />
                          <span>{item.label}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>+{item.points} pts</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                    <button onClick={() => setRationaleModalStudent(null)} className="btn btn-secondary">
                      Close
                    </button>
                    <button 
                      onClick={() => {
                        const target = rationaleModalStudent;
                        setRationaleModalStudent(null);
                        openProposalModal(target);
                      }} 
                      className="btn btn-primary"
                    >
                      Proceed to Request Exchange
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Send Proposal Modal */}
      {proposalModalStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>Send Skill Exchange Request</h2>
              <button onClick={() => setProposalModalStudent(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProposalSubmit}>
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={proposalModalStudent.avatar} alt={proposalModalStudent.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>To: {proposalModalStudent.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{proposalModalStudent.university}</div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Skill You Will Teach</label>
                <select 
                  value={offeredSkillId} 
                  onChange={(e) => {
                    setOfferedSkillId(e.target.value);
                    setAgreementText(`I'll teach 2 hours of ${getSkillName(e.target.value)} in exchange for 2 hours of ${getSkillName(requestedSkillId)}.`);
                  }}
                  className="select-field"
                  required
                >
                  {currentUser.teachSkills?.map(ts => (
                    <option key={ts.skillId} value={ts.skillId}>
                      {getSkillName(ts.skillId)} ({ts.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Skill You Want to Learn from {proposalModalStudent.name}</label>
                <select 
                  value={requestedSkillId} 
                  onChange={(e) => {
                    setRequestedSkillId(e.target.value);
                    setAgreementText(`I'll teach 2 hours of ${getSkillName(offeredSkillId)} in exchange for 2 hours of ${getSkillName(e.target.value)}.`);
                  }}
                  className="select-field"
                  required
                >
                  {proposalModalStudent.teachSkills?.map(ts => (
                    <option key={ts.skillId} value={ts.skillId}>
                      {getSkillName(ts.skillId)} ({ts.level})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Format</label>
                  <select value={proposedFormat} onChange={(e) => setProposedFormat(e.target.value)} className="select-field">
                    {Object.values(LEARNING_FORMATS).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Hours / Week</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={proposedHours} 
                    onChange={(e) => setProposedHours(e.target.value)} 
                    className="input-field" 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Proposed Reciprocal Agreement Terms</label>
                <textarea 
                  rows="3" 
                  value={agreementText}
                  onChange={(e) => setAgreementText(e.target.value)}
                  className="textarea-field"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setProposalModalStudent(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Send Exchange Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
