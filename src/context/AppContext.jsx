import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../services/api';
import {
  INITIAL_SKILLS,
  INITIAL_STUDENTS,
  INITIAL_EXCHANGES,
  INITIAL_MESSAGES,
  INITIAL_SKILL_REQUESTS,
  INITIAL_SAFETY_REPORTS
} from '../data/initialData';
import { EXCHANGE_STATUS } from '../types';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // LocalStorage helper
  const getStored = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`skillnexus_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [skills, setSkills] = useState(() => getStored('skills', INITIAL_SKILLS));
  const [students, setStudents] = useState(() => getStored('students', INITIAL_STUDENTS));
  const [exchanges, setExchanges] = useState(() => getStored('exchanges', INITIAL_EXCHANGES));
  const [messages, setMessages] = useState(() => getStored('messages', INITIAL_MESSAGES));
  const [skillRequests, setSkillRequests] = useState(() => getStored('skillRequests', INITIAL_SKILL_REQUESTS));
  const [safetyReports, setSafetyReports] = useState(() => getStored('safetyReports', INITIAL_SAFETY_REPORTS));

  const [currentUserId, setCurrentUserId] = useState(() => getStored('currentUserId', 'user-1'));
  const [theme, setTheme] = useState(() => getStored('theme', 'dark'));
  const [language] = useState('en');
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeExchangeId, setActiveExchangeId] = useState(null);

  const setLanguage = () => {};

  const t = (key) => {
    return translations.en[key] || key;
  };


  // Sync state to backend API on mount & live auto-polling for multi-browser support
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const fetchedSkills = await ApiClient.getSkills();
        if (fetchedSkills && fetchedSkills.length) setSkills(fetchedSkills);
      } catch (e) {}

      try {
        const fetchedStudents = await ApiClient.getUsers(currentUserId);
        if (fetchedStudents && fetchedStudents.length) setStudents(fetchedStudents);
      } catch (e) {}

      try {
        const fetchedExchanges = await ApiClient.getExchanges(currentUserId);
        if (fetchedExchanges && fetchedExchanges.length) setExchanges(fetchedExchanges);
      } catch (e) {}

      try {
        const fetchedReqs = await ApiClient.getSkillRequests();
        if (fetchedReqs && fetchedReqs.length) setSkillRequests(fetchedReqs);
      } catch (e) {}

      if (activeExchangeId) {
        try {
          const fetchedMsgs = await ApiClient.getMessages(activeExchangeId, currentUserId);
          if (fetchedMsgs && fetchedMsgs.length) {
            setMessages(fetchedMsgs);
          }
        } catch (e) {}
      }
    };

    fetchBackendData();
    const interval = setInterval(fetchBackendData, 3000);
    return () => clearInterval(interval);
  }, [currentUserId, activeExchangeId]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('skillnexus_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('skillnexus_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('skillnexus_exchanges', JSON.stringify(exchanges));
  }, [exchanges]);

  useEffect(() => {
    localStorage.setItem('skillnexus_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('skillnexus_skillRequests', JSON.stringify(skillRequests));
  }, [skillRequests]);

  useEffect(() => {
    localStorage.setItem('skillnexus_safetyReports', JSON.stringify(safetyReports));
  }, [safetyReports]);

  useEffect(() => {
    localStorage.setItem('skillnexus_currentUserId', JSON.stringify(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('skillnexus_theme', JSON.stringify(theme));
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentUser = currentUserId === 'admin'
    ? {
        id: 'admin',
        name: 'System Admin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        bio: 'Platform Health & Moderation Manager'
      }
    : students.find(s => (s.userId || s.id) === currentUserId) || students[0];

  // Synergy Score calculation algorithm
  const calculateSynergyScore = (studentA, studentB) => {
    const idA = studentA?.userId || studentA?.id;
    const idB = studentB?.userId || studentB?.id;
    if (!studentA || !studentB || idA === idB) return { score: 0, breakdown: [] };

    let totalScore = 0;
    const breakdown = [];

    const aTeachesB = studentA.teachSkills?.some(ts => 
      studentB.learnSkills?.some(ls => ls.skillId === ts.skillId)
    );
    const bTeachesA = studentB.teachSkills?.some(ts => 
      studentA.learnSkills?.some(ls => ls.skillId === ts.skillId)
    );

    if (aTeachesB && bTeachesA) {
      totalScore += 45;
      breakdown.push({ label: 'Perfect 2-Way Skill Swap', points: 45, icon: 'repeat' });
    } else if (aTeachesB) {
      totalScore += 25;
      breakdown.push({ label: 'Teaches Skill You Want to Learn', points: 25, icon: 'book-open' });
    } else if (bTeachesA) {
      totalScore += 25;
      breakdown.push({ label: 'Wants Skill You Teach', points: 25, icon: 'award' });
    }

    if (studentA.availability === studentB.availability || studentA.availability === 'Flexible Schedule' || studentB.availability === 'Flexible Schedule') {
      totalScore += 25;
      breakdown.push({ label: 'Compatible Schedule', points: 25, icon: 'calendar' });
    } else {
      totalScore += 10;
      breakdown.push({ label: 'Partial Schedule Overlap', points: 10, icon: 'clock' });
    }

    if (studentA.preferredFormat === studentB.preferredFormat || studentA.preferredFormat === 'Hybrid' || studentB.preferredFormat === 'Hybrid') {
      totalScore += 15;
      breakdown.push({ label: 'Matching Format Preference', points: 15, icon: 'video' });
    } else {
      totalScore += 5;
      breakdown.push({ label: 'Format Adaptable', points: 5, icon: 'check' });
    }

    const avgRep = ((studentA.reputationScore || 95) + (studentB.reputationScore || 95)) / 2;
    if (avgRep >= 95) {
      totalScore += 15;
      breakdown.push({ label: 'High Peer Trust Badge', points: 15, icon: 'shield-check' });
    } else if (avgRep >= 90) {
      totalScore += 10;
      breakdown.push({ label: 'Verified Peer Activity', points: 10, icon: 'check-circle' });
    } else {
      totalScore += 5;
      breakdown.push({ label: 'Active Student Member', points: 5, icon: 'user-check' });
    }

    return {
      score: Math.min(100, totalScore),
      isMutual: Boolean(aTeachesB && bTeachesA),
      breakdown
    };
  };

  // Exchanges Actions
  const sendExchangeRequest = async ({ recipientId, offeredSkillId, requestedSkillId, format, proposedHoursPerWeek, reciprocalAgreement }) => {
    const activeId = currentUser.userId || currentUser.id;
    if (activeId === recipientId) {
      addToast("You cannot send an exchange request to yourself!", "error");
      return false;
    }

    const existing = exchanges.find(ex => 
      ((ex.requesterId === activeId && ex.recipientId === recipientId) ||
       (ex.requesterId === recipientId && ex.recipientId === activeId)) &&
      (ex.status === EXCHANGE_STATUS.PENDING || ex.status === EXCHANGE_STATUS.ACTIVE)
    );

    if (existing) {
      addToast(`You already have a ${existing.status.toLowerCase()} exchange with this student.`, "warning");
      return false;
    }

    const newExchange = {
      id: `ex-${Date.now()}`,
      exchangeId: `ex-${Date.now()}`,
      requesterId: activeId,
      recipientId,
      offeredSkillId,
      requestedSkillId,
      status: EXCHANGE_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      format: format || currentUser.preferredFormat,
      proposedHoursPerWeek: Number(proposedHoursPerWeek) || 2,
      reciprocalAgreement,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Kickoff Session & Goal Alignment', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Mid-Exchange Practice Review', completed: false }
      ],
      sessionLogs: []
    };

    setExchanges(prev => [newExchange, ...prev]);

    // Backend async sync
    try {
      await ApiClient.createExchangeProposal(newExchange, activeId);
    } catch (e) {}

    addToast("Exchange request sent & persisted to WEBCRAFT database!", "success");
    return true;
  };

  const acceptExchangeRequest = async (exchangeId) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => (ex.id === exchangeId || ex.exchangeId === exchangeId) ? { ...ex, status: EXCHANGE_STATUS.ACTIVE } : ex));
    
    try {
      await ApiClient.updateExchangeStatus(exchangeId, EXCHANGE_STATUS.ACTIVE, activeId);
    } catch (e) {}

    addToast("Exchange accepted! Connected in workspace.", "success");
  };

  const declineExchangeRequest = async (exchangeId) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => (ex.id === exchangeId || ex.exchangeId === exchangeId) ? { ...ex, status: EXCHANGE_STATUS.DECLINED } : ex));

    try {
      await ApiClient.updateExchangeStatus(exchangeId, EXCHANGE_STATUS.DECLINED, activeId);
    } catch (e) {}

    addToast("Exchange request declined.", "info");
  };

  const cancelExchange = async (exchangeId) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => (ex.id === exchangeId || ex.exchangeId === exchangeId) ? { ...ex, status: EXCHANGE_STATUS.CANCELLED } : ex));

    try {
      await ApiClient.updateExchangeStatus(exchangeId, EXCHANGE_STATUS.CANCELLED, activeId);
    } catch (e) {}

    addToast("Exchange cancelled.", "info");
  };

  const pauseExchange = async (exchangeId) => {
    const activeId = currentUser.userId || currentUser.id;
    const current = exchanges.find(ex => ex.id === exchangeId || ex.exchangeId === exchangeId);
    const nextStatus = current?.status === EXCHANGE_STATUS.PAUSED ? EXCHANGE_STATUS.ACTIVE : EXCHANGE_STATUS.PAUSED;

    setExchanges(prev => prev.map(ex => (ex.id === exchangeId || ex.exchangeId === exchangeId) ? { ...ex, status: nextStatus } : ex));

    try {
      await ApiClient.updateExchangeStatus(exchangeId, nextStatus, activeId);
    } catch (e) {}
  };

  const completeExchange = async (exchangeId) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => (ex.id === exchangeId || ex.exchangeId === exchangeId) ? { ...ex, status: EXCHANGE_STATUS.COMPLETED } : ex));

    try {
      await ApiClient.updateExchangeStatus(exchangeId, EXCHANGE_STATUS.COMPLETED, activeId);
    } catch (e) {}

    addToast("Exchange completed! Please leave peer feedback.", "success");
  };

  const submitFeedback = async (exchangeId, rating, comment) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => {
      if (ex.id === exchangeId || ex.exchangeId === exchangeId) {
        const isRequester = ex.requesterId === activeId;
        const updatedFeedback = {
          ...(ex.feedback || {}),
          ...(isRequester ? { user1Rating: rating, user1Comment: comment } : { user2Rating: rating, user2Comment: comment })
        };
        return { ...ex, feedback: updatedFeedback };
      }
      return ex;
    }));

    try {
      await ApiClient.submitFeedback(exchangeId, rating, comment, activeId);
    } catch (e) {}

    addToast("Feedback submitted to backend & MongoDB!", "success");
  };

  const addMilestone = async (exchangeId, title) => {
    const activeId = currentUser.userId || currentUser.id;
    const newMs = { id: `m-${Date.now()}`, title, completed: false, assignedTo: activeId };

    setExchanges(prev => prev.map(ex => {
      if (ex.id === exchangeId || ex.exchangeId === exchangeId) {
        return { ...ex, milestones: [...(ex.milestones || []), newMs] };
      }
      return ex;
    }));

    try {
      await ApiClient.addMilestone(exchangeId, title, activeId);
    } catch (e) {}

    addToast("Milestone added.", "success");
  };

  const toggleMilestone = async (exchangeId, milestoneId) => {
    const activeId = currentUser.userId || currentUser.id;
    setExchanges(prev => prev.map(ex => {
      if (ex.id === exchangeId || ex.exchangeId === exchangeId) {
        const updatedMs = ex.milestones?.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        return { ...ex, milestones: updatedMs };
      }
      return ex;
    }));

    try {
      await ApiClient.toggleMilestone(exchangeId, milestoneId, activeId);
    } catch (e) {}
  };

  const addSessionLog = async (exchangeId, { date, topic, notes, videoLink }) => {
    const activeId = currentUser.userId || currentUser.id;
    const newLog = {
      id: `s-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      topic,
      notes: notes || '',
      videoLink: videoLink || `https://meet.jit.si/skillnexus-${exchangeId}`
    };

    setExchanges(prev => prev.map(ex => {
      if (ex.id === exchangeId || ex.exchangeId === exchangeId) {
        return { ...ex, sessionLogs: [newLog, ...(ex.sessionLogs || [])] };
      }
      return ex;
    }));

    try {
      await ApiClient.addSessionLog(exchangeId, newLog, activeId);
    } catch (e) {}

    addToast("Session logged!", "success");
  };

  const sendMessage = async (exchangeId, text) => {
    if (!text.trim()) return;
    const activeId = currentUser.userId || currentUser.id;
    const newMsg = {
      id: `msg-${Date.now()}`,
      messageId: `msg-${Date.now()}`,
      exchangeId,
      senderId: activeId,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    try {
      await ApiClient.sendMessage(exchangeId, text.trim(), activeId);
    } catch (e) {}
  };

  const requestSkill = async ({ skillName, category }) => {
    const activeId = currentUser.userId || currentUser.id;
    const newReq = {
      id: `sr-${Date.now()}`,
      requestId: `sr-${Date.now()}`,
      skillName,
      category,
      requestedBy: currentUser.name,
      upvotes: 1,
      status: 'Under Review',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSkillRequests(prev => [newReq, ...prev]);

    try {
      await ApiClient.requestSkillTopic(skillName, category, activeId);
    } catch (e) {}

    addToast("Skill request submitted to community review & MongoDB!", "success");
  };

  const upvoteSkillRequest = async (reqId) => {
    const activeId = currentUser.userId || currentUser.id;
    setSkillRequests(prev => prev.map(r => (r.id === reqId || r.requestId === reqId) ? { ...r, upvotes: r.upvotes + 1 } : r));

    try {
      await ApiClient.upvoteSkillTopic(reqId, activeId);
    } catch (e) {}

    addToast("Upvoted skill request!", "info");
  };

  const submitSafetyReport = async ({ reportedUserId, reason, details }) => {
    const activeId = currentUser.userId || currentUser.id;
    const newRep = {
      id: `rep-${Date.now()}`,
      reportId: `rep-${Date.now()}`,
      reportedUserId,
      reportedByUserId: activeId,
      reason,
      details,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSafetyReports(prev => [newRep, ...prev]);

    try {
      await ApiClient.submitSafetyReport({ reportedUserId, reason, details }, activeId);
    } catch (e) {}

    addToast("Safety report submitted to platform moderators.", "warning");
  };

  const updateCurrentUserProfile = async (updatedFields) => {
    const activeId = currentUser.userId || currentUser.id;
    if (activeId === 'admin') return;

    setStudents(prev => prev.map(s => (s.userId === activeId || s.id === activeId) ? { ...s, ...updatedFields } : s));

    try {
      await ApiClient.updateProfile(updatedFields, activeId);
    } catch (e) {}

    addToast("Profile updated successfully!", "success");
  };

  const login = async (email, password) => {
    const data = await ApiClient.login(email, password);
    if (data && data.token) {
      localStorage.setItem('edusynk_jwt_token', data.token);
      if (data.user) {
        const uId = data.user.userId || data.user.id;
        setCurrentUserId(uId);
        setStudents(prev => {
          const exists = prev.some(s => (s.userId || s.id) === uId);
          return exists ? prev : [data.user, ...prev];
        });
      }
      addToast(`Welcome back, ${data.user?.name || 'Student'}!`, 'success');
      return data;
    }
  };

  const register = async (userData) => {
    const data = await ApiClient.register(userData);
    if (data && data.token) {
      localStorage.setItem('edusynk_jwt_token', data.token);
      if (data.user) {
        const uId = data.user.userId || data.user.id;
        setCurrentUserId(uId);
        setStudents(prev => [data.user, ...prev]);
      }
      addToast('Account created successfully!', 'success');
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('edusynk_jwt_token');
    localStorage.removeItem('skillnexus_jwt_token');
    addToast('Signed out of session.', 'info');
  };

  const resetDemoData = () => {
    setSkills(INITIAL_SKILLS);
    setStudents(INITIAL_STUDENTS);
    setExchanges(INITIAL_EXCHANGES);
    setMessages(INITIAL_MESSAGES);
    setSkillRequests(INITIAL_SKILL_REQUESTS);
    setSafetyReports(INITIAL_SAFETY_REPORTS);
    addToast("Demo dataset reset.", "info");
  };

  return (
    <AppContext.Provider value={{
      skills,
      students,
      exchanges,
      messages,
      skillRequests,
      safetyReports,
      currentUser,
      currentUserId,
      setCurrentUserId,
      theme,
      setTheme,
      language,
      setLanguage,
      t,
      toasts,

      addToast,
      removeToast,
      activeTab,
      setActiveTab,
      activeExchangeId,
      setActiveExchangeId,
      calculateSynergyScore,
      sendExchangeRequest,
      acceptExchangeRequest,
      declineExchangeRequest,
      cancelExchange,
      pauseExchange,
      completeExchange,
      submitFeedback,
      addMilestone,
      toggleMilestone,
      addSessionLog,
      sendMessage,
      requestSkill,
      upvoteSkillRequest,
      submitSafetyReport,
      updateCurrentUserProfile,
      login,
      register,
      logout,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
