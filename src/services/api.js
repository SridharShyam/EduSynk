const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiClient {
  static getAuthHeader() {
    const token = localStorage.getItem('edusynk_jwt_token') || localStorage.getItem('skillnexus_jwt_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = this.getAuthHeader();
      const config = {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {})
        }
      };

      const response = await fetch(url, config);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `HTTP error ${response.status}`);
      }

      return json.data;
    } catch (err) {
      console.warn(`[API Client Warning] Endpoint ${endpoint} request failed: ${err.message}. Using reactive local state fallback.`);
      throw err;
    }
  }

  // Auth APIs
  static async login(email, password) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  static async register(userData) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // User APIs
  static async getUsers(activeUserId) {
    return await this.request('/users', { method: 'GET' }, activeUserId);
  }

  static async updateProfile(updateData, activeUserId) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }, activeUserId);
  }

  static async getSynergyScore(targetUserId, activeUserId) {
    return await this.request(`/users/${targetUserId}/synergy`, { method: 'GET' }, activeUserId);
  }

  // Skill APIs
  static async getSkills() {
    return await this.request('/skills', { method: 'GET' });
  }

  static async getSkillRequests() {
    return await this.request('/skills/requests', { method: 'GET' });
  }

  static async requestSkillTopic(skillName, category, activeUserId) {
    return await this.request('/skills/request', {
      method: 'POST',
      body: JSON.stringify({ skillName, category })
    }, activeUserId);
  }

  static async upvoteSkillTopic(requestId, activeUserId) {
    return await this.request(`/skills/request/${requestId}/upvote`, {
      method: 'POST'
    }, activeUserId);
  }

  // Exchange APIs
  static async getExchanges(activeUserId) {
    return await this.request('/exchanges', { method: 'GET' }, activeUserId);
  }

  static async createExchangeProposal(proposalData, activeUserId) {
    return await this.request('/exchanges', {
      method: 'POST',
      body: JSON.stringify(proposalData)
    }, activeUserId);
  }

  static async updateExchangeStatus(exchangeId, status, activeUserId) {
    return await this.request(`/exchanges/${exchangeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }, activeUserId);
  }

  static async addMilestone(exchangeId, title, activeUserId) {
    return await this.request(`/exchanges/${exchangeId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({ title })
    }, activeUserId);
  }

  static async toggleMilestone(exchangeId, milestoneId, activeUserId) {
    return await this.request(`/exchanges/${exchangeId}/milestones/${milestoneId}`, {
      method: 'PATCH'
    }, activeUserId);
  }

  static async addSessionLog(exchangeId, sessionLog, activeUserId) {
    return await this.request(`/exchanges/${exchangeId}/sessions`, {
      method: 'POST',
      body: JSON.stringify(sessionLog)
    }, activeUserId);
  }

  static async submitFeedback(exchangeId, rating, comment, activeUserId) {
    return await this.request(`/exchanges/${exchangeId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    }, activeUserId);
  }

  // Message APIs
  static async getMessages(exchangeId, activeUserId) {
    return await this.request(`/messages/exchange/${exchangeId}`, { method: 'GET' }, activeUserId);
  }

  static async sendMessage(exchangeId, text, activeUserId) {
    return await this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ exchangeId, text })
    }, activeUserId);
  }

  // Moderation APIs
  static async submitSafetyReport(reportData, activeUserId) {
    return await this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    }, activeUserId);
  }

  static async getSafetyReports(activeUserId) {
    return await this.request('/reports', { method: 'GET' }, activeUserId);
  }
}

export default ApiClient;
