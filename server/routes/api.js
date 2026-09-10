import express from 'express';
import { 
  AuthController, 
  UserController, 
  SkillController, 
  ExchangeController, 
  MessageController, 
  ReportController,
  SearchController,
  AIController
} from '../controllers/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'WEBCRAFT', timestamp: new Date().toISOString() });
});

// Search API Endpoint (Public / Authenticated)
router.get('/search', SearchController.search);

// Interactive AI Assistant Chat Endpoint
router.post('/ai/chat', AIController.chat);

// Authentication Routes

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authenticateToken, AuthController.me);

// User & Synergy Routes
router.get('/users', authenticateToken, UserController.getAll);
router.get('/users/:id', authenticateToken, UserController.getById);
router.put('/users/profile', authenticateToken, UserController.updateProfile);
router.get('/users/:id/synergy', authenticateToken, UserController.getSynergy);

// Skill Catalog & Topic Request Routes
router.get('/skills', SkillController.getAll);
router.get('/skills/requests', SkillController.getRequests);
router.post('/skills/request', authenticateToken, SkillController.requestTopic);
router.post('/skills/request/:id/upvote', authenticateToken, SkillController.upvoteRequest);

// Exchange Lifecycle Routes
router.get('/exchanges', authenticateToken, ExchangeController.getExchanges);
router.post('/exchanges', authenticateToken, ExchangeController.createProposal);
router.patch('/exchanges/:id/status', authenticateToken, ExchangeController.updateStatus);
router.post('/exchanges/:id/milestones', authenticateToken, ExchangeController.addMilestone);
router.patch('/exchanges/:id/milestones/:milestoneId', authenticateToken, ExchangeController.toggleMilestone);
router.post('/exchanges/:id/sessions', authenticateToken, ExchangeController.addSessionLog);
router.post('/exchanges/:id/feedback', authenticateToken, ExchangeController.submitFeedback);

// Context Messaging Routes
router.get('/messages/exchange/:exchangeId', authenticateToken, MessageController.getMessages);
router.post('/messages', authenticateToken, MessageController.sendMessage);

// Safety Moderation & Reports Routes
router.post('/reports', authenticateToken, ReportController.submitReport);
router.get('/reports', authenticateToken, requireAdmin, ReportController.getReports);
router.patch('/reports/:id/resolve', authenticateToken, requireAdmin, ReportController.resolveReport);

export default router;
