import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRightLeft, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react';

export const MatchEngineView = () => {
  const { students, skills, calculateSynergyScore } = useApp();

  const [studentAId, setStudentAId] = useState(students[0]?.id || 'user-1');
  const [studentBId, setStudentBId] = useState(students[1]?.id || 'user-2');

  const studentA = students.find(s => s.id === studentAId) || students[0];
  const studentB = students.find(s => s.id === studentBId) || students[1];

  const synergy = calculateSynergyScore(studentA, studentB);
  const getSkillName = (id) => skills.find(s => s.id === id || s.skillId === id)?.name || id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={28} className="gradient-synergy-text" /> Smart Mutual Synergy Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
          Test and analyze how SkillNexus calculates reciprocal student compatibility without hidden arbitrary black-box scores.
        </p>
      </div>

      {/* Interactive Match Selector */}
      <div className="card glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>
          
          {/* Student A Selector */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-lg)' }}>
            <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Student A Persona</label>
            <select 
              value={studentAId} 
              onChange={(e) => setStudentAId(e.target.value)} 
              className="select-field"
              style={{ marginBottom: 12 }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.major})</option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={studentA.avatar} alt={studentA.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{studentA.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Teaches: {studentA.teachSkills.map(ts => getSkillName(ts.skillId)).join(', ')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>Wants: {studentA.learnSkills.map(ls => getSkillName(ls.skillId)).join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Swap / VS Icon */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <ArrowRightLeft size={22} color="#ffffff" />
            </div>
          </div>

          {/* Student B Selector */}
          <div style={{ background: 'var(--bg-tertiary)', padding: 16, borderRadius: 'var(--radius-lg)' }}>
            <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Student B Persona</label>
            <select 
              value={studentBId} 
              onChange={(e) => setStudentBId(e.target.value)} 
              className="select-field"
              style={{ marginBottom: 12 }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.major})</option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={studentB.avatar} alt={studentB.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{studentB.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Teaches: {studentB.teachSkills.map(ts => getSkillName(ts.skillId)).join(', ')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>Wants: {studentB.learnSkills.map(ls => getSkillName(ls.skillId)).join(', ')}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Result Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        
        {/* Score Gauge Box */}
        <div className="card" style={{ textAlign: 'center', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 800 }} className="gradient-synergy-text">
            {synergy.score}%
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>
            {synergy.isMutual ? '100% 2-Way Reciprocal Swap!' : 'High Synergy Alignment'}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Based on mutual skill availability, schedule overlap, format compatibility, and peer trust badges.
          </p>
        </div>

        {/* Breakdown Items */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="var(--accent-emerald)" /> Synergy Factor Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {synergy.breakdown.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Contributes directly to high exchange success probability</div>
                  </div>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>+{item.points} pts</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
