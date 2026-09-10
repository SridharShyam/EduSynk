import { ServiceFactory } from '../factories/ServiceFactory.js';
import { ResponseFactory } from '../factories/ResponseFactory.js';

const userService = ServiceFactory.createUserService();
const skillService = ServiceFactory.createSkillService();
const exchangeService = ServiceFactory.createExchangeService();
const messageService = ServiceFactory.createMessageService();
const reportService = ServiceFactory.createReportService();
const matchingService = ServiceFactory.createMatchingService();
const aiService = ServiceFactory.createAIService();
const searchService = ServiceFactory.createSearchService();

export class AuthController {

  static async register(req, res, next) {
    try {
      const result = await userService.registerUser(req.body);
      return ResponseFactory.success(res, result, 'User registered successfully', 201);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'REGISTRATION_FAILED');
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ResponseFactory.error(res, 'Email and password are required', 400, 'MISSING_FIELDS');
      }
      const result = await userService.loginUser(email, password);
      return ResponseFactory.success(res, result, 'Login successful');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 401, 'INVALID_CREDENTIALS');
    }
  }

  static async me(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.userId);
      return ResponseFactory.success(res, user, 'Profile fetched successfully');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 404, 'USER_NOT_FOUND');
    }
  }
}

export class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return ResponseFactory.success(res, users, 'Users fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const user = await userService.getProfile(req.params.id);
      return ResponseFactory.success(res, user);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 404, 'USER_NOT_FOUND');
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updated = await userService.updateProfile(req.user.userId, req.body);
      return ResponseFactory.success(res, updated, 'Profile updated successfully');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'UPDATE_FAILED');
    }
  }

  static async getSynergy(req, res, next) {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user?.userId || req.query.currentUserId || 'user-1';
      const synergy = await matchingService.getSynergyScore(currentUserId, targetUserId);
      return ResponseFactory.success(res, synergy, 'Synergy score calculated');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'SYNERGY_CALC_FAILED');
    }
  }
}

export class SkillController {
  static async getAll(req, res, next) {
    try {
      const skills = await skillService.getAllSkills();
      return ResponseFactory.success(res, skills, 'Skills fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getRequests(req, res, next) {
    try {
      const requests = await skillService.getAllSkillRequests();
      return ResponseFactory.success(res, requests, 'Skill requests fetched');
    } catch (err) {
      next(err);
    }
  }

  static async requestTopic(req, res, next) {
    try {
      const { skillName, category } = req.body;
      const requestedBy = req.user?.name || req.body.requestedBy || 'Student';
      const result = await skillService.requestSkillTopic(skillName, category, requestedBy);
      return ResponseFactory.success(res, result, 'Skill request submitted', 201);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'SKILL_REQUEST_FAILED');
    }
  }

  static async upvoteRequest(req, res, next) {
    try {
      const updated = await skillService.upvoteSkillTopic(req.params.id);
      return ResponseFactory.success(res, updated, 'Upvoted skill request');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'UPVOTE_FAILED');
    }
  }
}

export class ExchangeController {
  static async getExchanges(req, res, next) {
    try {
      const userId = req.user?.userId || req.query.userId || 'user-1';
      const exchanges = await exchangeService.getUserExchanges(userId);
      return ResponseFactory.success(res, exchanges, 'Exchanges fetched');
    } catch (err) {
      next(err);
    }
  }

  static async createProposal(req, res, next) {
    try {
      const requesterId = req.user?.userId || req.body.requesterId;
      const proposalData = { ...req.body, requesterId };
      const exchange = await exchangeService.createExchangeProposal(proposalData);
      return ResponseFactory.success(res, exchange, 'Exchange proposal created', 201);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'PROPOSAL_FAILED');
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const userId = req.user?.userId || req.body.userId || 'user-1';
      const updated = await exchangeService.updateExchangeStatus(req.params.id, status, userId);
      return ResponseFactory.success(res, updated, `Exchange status updated to ${status}`);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'STATUS_UPDATE_FAILED');
    }
  }

  static async addMilestone(req, res, next) {
    try {
      const { title } = req.body;
      const userId = req.user?.userId || req.body.userId || 'user-1';
      const updated = await exchangeService.addMilestone(req.params.id, title, userId);
      return ResponseFactory.success(res, updated, 'Milestone added');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'MILESTONE_ADD_FAILED');
    }
  }

  static async toggleMilestone(req, res, next) {
    try {
      const { milestoneId } = req.params;
      const updated = await exchangeService.toggleMilestone(req.params.id, milestoneId);
      return ResponseFactory.success(res, updated, 'Milestone toggled');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'MILESTONE_TOGGLE_FAILED');
    }
  }

  static async addSessionLog(req, res, next) {
    try {
      const updated = await exchangeService.addSessionLog(req.params.id, req.body);
      return ResponseFactory.success(res, updated, 'Session log added');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'SESSION_LOG_FAILED');
    }
  }

  static async submitFeedback(req, res, next) {
    try {
      const userId = req.user?.userId || req.body.userId || 'user-1';
      const { rating, comment } = req.body;
      const updated = await exchangeService.submitPeerFeedback(req.params.id, userId, rating, comment);
      return ResponseFactory.success(res, updated, 'Peer feedback submitted');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'FEEDBACK_SUBMIT_FAILED');
    }
  }
}

export class MessageController {
  static async getMessages(req, res, next) {
    try {
      const messages = await messageService.getMessagesForExchange(req.params.exchangeId);
      return ResponseFactory.success(res, messages, 'Messages fetched');
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req, res, next) {
    try {
      const senderId = req.user?.userId || req.body.senderId || 'user-1';
      const { exchangeId, text } = req.body;
      const message = await messageService.sendMessage(exchangeId, senderId, text);
      return ResponseFactory.success(res, message, 'Message sent', 201);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'MESSAGE_SEND_FAILED');
    }
  }
}

export class ReportController {
  static async submitReport(req, res, next) {
    try {
      const reportedByUserId = req.user?.userId || req.body.reportedByUserId || 'user-1';
      const report = await reportService.submitReport({ ...req.body, reportedByUserId });
      return ResponseFactory.success(res, report, 'Safety report submitted', 201);
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'REPORT_SUBMIT_FAILED');
    }
  }

  static async getReports(req, res, next) {
    try {
      const reports = await reportService.getReports();
      return ResponseFactory.success(res, reports, 'Reports fetched');
    } catch (err) {
      next(err);
    }
  }

  static async resolveReport(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await reportService.resolveReport(req.params.id, status || 'Resolved');
      return ResponseFactory.success(res, updated, 'Report status updated');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'REPORT_RESOLVE_FAILED');
    }
  }
}

export class SearchController {
  static async search(req, res, next) {
    try {
      const { q, category, format, page, limit } = req.query;
      const searchResult = await searchService.search({
        query: q || '',
        category: category || '',
        format: format || '',
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10
      });
      return ResponseFactory.success(res, searchResult, 'Search completed successfully');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 400, 'SEARCH_FAILED');
    }
  }
}

export class AIController {
  static async chat(req, res, next) {
    try {
      const { message, context, language } = req.body;
      const userContext = context || (req.user ? await userService.getProfile(req.user.userId) : {});
      const response = await aiService.getChatResponse(message, userContext, language || 'en');
      return ResponseFactory.success(res, response, 'AI response generated successfully');
    } catch (err) {
      return ResponseFactory.error(res, err.message, 500, 'AI_CHAT_FAILED');
    }
  }
}

