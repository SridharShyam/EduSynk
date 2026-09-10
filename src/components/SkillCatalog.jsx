import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SKILL_CATEGORIES } from '../types';
import { 
  Search, 
  PlusCircle, 
  BookOpen, 
  Users, 
  Star, 
  Filter, 
  X, 
  ThumbsUp, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const SkillCatalog = () => {
  const { 
    skills, 
    students, 
    skillRequests, 
    requestSkill, 
    upvoteSkillRequest,
    setActiveTab 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [detailSkillModal, setDetailSkillModal] = useState(null);

  // New Skill Request Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(SKILL_CATEGORIES[1]);

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'All Categories' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (skill.tags && skill.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getTeachersForSkill = (skillId) => {
    return students.filter(s => s.teachSkills.some(ts => ts.skillId === skillId));
  };

  const getLearnersForSkill = (skillId) => {
    return students.filter(s => s.learnSkills.some(ls => ls.skillId === skillId));
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    requestSkill({ skillName: newSkillName.trim(), category: newSkillCategory });
    setNewSkillName('');
    setRequestModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={28} className="gradient-text" /> Discover Skills System
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
            Explore structured peer skills, see who can teach them, and request new topics.
          </p>
        </div>

        <button 
          onClick={() => setRequestModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Request New Skill Topic
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search skills by keyword, category, or tag (e.g., Python, Figma, Spanish, Speech)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 42, height: 46 }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`badge ${selectedCategory === cat ? 'badge-primary' : 'badge-amber'}`}
              style={{ 
                cursor: 'pointer', 
                padding: '6px 14px', 
                fontSize: '0.8rem',
                opacity: selectedCategory === cat ? 1 : 0.7 
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Grid */}
      {filteredSkills.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredSkills.map(skill => {
            const teachers = getTeachersForSkill(skill.id);
            const learners = getLearnersForSkill(skill.id);

            return (
              <div 
                key={skill.id} 
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {skill.category}
                    </span>
                    {skill.popular && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        <Star size={12} /> Popular Exchange
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{skill.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 14 }}>
                    {skill.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {skill.tags?.map(tag => (
                      <span key={tag} style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-emerald)' }}>
                      <BookOpen size={16} /> <strong>{teachers.length}</strong> Student Mentors
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)' }}>
                      <Users size={16} /> <strong>{learners.length}</strong> Learners
                    </div>
                  </div>

                  <button 
                    onClick={() => setDetailSkillModal(skill)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    View Students Teaching This <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>No skills matching "{searchQuery}" found in {selectedCategory}.</p>
          <button onClick={() => setRequestModalOpen(true)} className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
            Propose this skill topic to the community
          </button>
        </div>
      )}

      {/* Community Skill Requests Section */}
      <div className="card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThumbsUp size={20} color="var(--accent-amber)" /> Community Requested Skill Topics
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Students can request skills not currently in the catalog. Upvote topics you'd like to teach or learn!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {skillRequests.map(req => (
            <div key={req.id} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{req.skillName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Category: {req.category} • By {req.requestedBy}
                </div>
              </div>
              <button 
                onClick={() => upvoteSkillRequest(req.id)}
                className="btn btn-secondary btn-sm"
                style={{ gap: 6 }}
              >
                <ThumbsUp size={14} color="var(--accent-amber)" /> {req.upvotes}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Request New Skill Modal */}
      {requestModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.2rem' }}>Propose a New Skill Topic</h2>
              <button onClick={() => setRequestModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="input-group">
                <label className="input-label">Skill Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Rust Programming, Japanese Conversation..." 
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select 
                  value={newSkillCategory} 
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="select-field"
                >
                  {SKILL_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setRequestModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Detail Modal */}
      {detailSkillModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-purple">{detailSkillModal.category}</span>
                <h2 style={{ fontSize: '1.4rem', marginTop: 4 }}>{detailSkillModal.name}</h2>
              </div>
              <button onClick={() => setDetailSkillModal(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              {detailSkillModal.description}
            </p>

            <h3 style={{ fontSize: '1.05rem', marginBottom: 12, color: 'var(--accent-emerald)' }}>
              Students Who Can Teach {detailSkillModal.name}:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {getTeachersForSkill(detailSkillModal.id).map(teacher => (
                <div key={teacher.id} style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={teacher.avatar} alt={teacher.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{teacher.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{teacher.major}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setDetailSkillModal(null);
                      setActiveTab('students');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    View Student Profile
                  </button>
                </div>
              ))}

              {getTeachersForSkill(detailSkillModal.id).length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  No students currently offering this skill yet. Be the first to list it on your profile!
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetailSkillModal(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
