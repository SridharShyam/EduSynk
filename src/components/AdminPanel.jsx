import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Repeat, 
  ThumbsUp, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    students, 
    exchanges, 
    skillRequests, 
    safetyReports, 
    addToast 
  } = useApp();

  const openReports = safetyReports.filter(r => r.status === 'Open');
  const pendingSkillRequests = skillRequests.filter(sr => sr.status === 'Under Review');

  const handleResolveReport = (reportId) => {
    addToast(`Safety report #${reportId} resolved and archived.`, "success");
  };

  const handleApproveSkill = (reqId, skillName) => {
    addToast(`Skill "${skillName}" approved and added to live catalog!`, "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldAlert size={28} color="var(--accent-purple)" /> Platform Moderation & Safety Admin
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 4 }}>
          Least-privilege administrative tools for platform safety, content reports, and skill topic approval.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} color="#f43f5e" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{openReports.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Safety Reports</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThumbsUp size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingSkillRequests.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Skill Requests</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Repeat size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{exchanges.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Exchanges Created</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{students.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Students</div>
          </div>
        </div>
      </div>

      {/* Safety Reports Section */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: 14, color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={20} /> Open Safety & Incident Reports
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {openReports.map(rep => {
            const reportedUser = students.find(s => s.id === rep.reportedUserId);
            const reportingUser = students.find(s => s.id === rep.reportedByUserId);

            return (
              <div key={rep.id} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    Report against {reportedUser?.name} by {reportingUser?.name || 'Student'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', marginTop: 2 }}>
                    Reason: {rep.reason}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    "{rep.details}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleResolveReport(rep.id)} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={14} /> Resolve & Issue Warning
                  </button>
                  <button onClick={() => handleResolveReport(rep.id)} className="btn btn-secondary btn-sm">
                    Dismiss Report
                  </button>
                </div>
              </div>
            );
          })}

          {openReports.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No open safety reports! Platform is healthy.
            </div>
          )}
        </div>
      </div>

      {/* Pending Skill Topics Approvals */}
      <div className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={20} color="var(--accent-amber)" /> Skill Catalog Approval Queue
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {skillRequests.map(req => (
            <div key={req.id} style={{ background: 'var(--bg-tertiary)', padding: 14, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.skillName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Category: {req.category} • Requested by {req.requestedBy} ({req.upvotes} upvotes)
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleApproveSkill(req.id, req.skillName)} className="btn btn-primary btn-sm">
                  <CheckCircle2 size={14} /> Approve & Add to Catalog
                </button>
                <button className="btn btn-secondary btn-sm">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
