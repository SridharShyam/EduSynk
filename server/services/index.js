import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SynergyMatchingStrategy } from './matching/SynergyStrategy.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userData) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const userId = userData.userId || `user-${Date.now()}`;
    const userToSave = {
      ...userData,
      userId,
      password: hashedPassword
    };

    const user = await this.userRepository.create(userToSave);
    const token = this.generateToken(user);

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;

    return { user: userObj, token };
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;

    return { user: userObj, token };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) throw new Error('User not found');
    delete user.password;
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(u => {
      delete u.password;
      return u;
    });
  }

  async updateProfile(userId, updateFields) {
    // Exclude password or role updates directly through profile route
    delete updateFields.password;
    delete updateFields.role;

    const updated = await this.userRepository.updateByUserId(userId, updateFields);
    if (updated) delete updated.password;
    return updated;
  }

  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'skillnexus_super_secret_key_2026_webcraft';
    return jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );
  }
}

export class SkillService {
  constructor(skillRepository, skillRequestRepository) {
    this.skillRepository = skillRepository;
    this.skillRequestRepository = skillRequestRepository;
  }

  async getAllSkills() {
    return await this.skillRepository.findAll();
  }

  async getAllSkillRequests() {
    return await this.skillRequestRepository.findAll();
  }

  async requestSkillTopic(skillName, category, requestedBy) {
    const requestId = `sr-${Date.now()}`;
    return await this.skillRequestRepository.create({
      requestId,
      skillName,
      category,
      requestedBy
    });
  }

  async upvoteSkillTopic(requestId) {
    return await this.skillRequestRepository.upvote(requestId);
  }

  async updateRequestStatus(requestId, status) {
    return await this.skillRequestRepository.updateStatus(requestId, status);
  }
}

export class ExchangeService {
  constructor(exchangeRepository, userRepository) {
    this.exchangeRepository = exchangeRepository;
    this.userRepository = userRepository;
  }

  async getUserExchanges(userId) {
    return await this.exchangeRepository.findByParticipant(userId);
  }

  async createExchangeProposal({ requesterId, recipientId, offeredSkillId, requestedSkillId, format, proposedHoursPerWeek, reciprocalAgreement }) {
    if (requesterId === recipientId) {
      throw new Error('Self exchange request is not permitted.');
    }

    const existing = await this.exchangeRepository.findExistingActiveOrPending(requesterId, recipientId);
    if (existing) {
      throw new Error(`An exchange between these students already exists with status: ${existing.status}`);
    }

    const newExchange = {
      exchangeId: `ex-${Date.now()}`,
      requesterId,
      recipientId,
      offeredSkillId,
      requestedSkillId,
      status: 'Pending',
      format,
      proposedHoursPerWeek: Number(proposedHoursPerWeek) || 2,
      reciprocalAgreement,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Kickoff Session & Goal Alignment', completed: false },
        { id: `m-${Date.now()}-2`, title: 'Mid-Exchange Practice Review', completed: false }
      ],
      sessionLogs: []
    };

    return await this.exchangeRepository.create(newExchange);
  }

  async updateExchangeStatus(exchangeId, status, userId) {
    const validStatuses = ['Accepted', 'Declined', 'Active', 'Paused', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid exchange status transition.');
    }

    const exchange = await this.exchangeRepository.findByExchangeId(exchangeId);
    if (!exchange) throw new Error('Exchange not found');

    if (exchange.requesterId !== userId && exchange.recipientId !== userId) {
      throw new Error('Unauthorized to modify this exchange.');
    }

    return await this.exchangeRepository.updateStatus(exchangeId, status);
  }

  async addMilestone(exchangeId, title, userId) {
    const milestone = {
      id: `m-${Date.now()}`,
      title,
      completed: false,
      assignedTo: userId
    };
    return await this.exchangeRepository.addMilestone(exchangeId, milestone);
  }

  async toggleMilestone(exchangeId, milestoneId) {
    return await this.exchangeRepository.toggleMilestone(exchangeId, milestoneId);
  }

  async addSessionLog(exchangeId, { date, topic, notes, videoLink }) {
    const sessionLog = {
      id: `s-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      topic,
      notes: notes || '',
      videoLink: videoLink || `https://meet.jit.si/skillnexus-${exchangeId}`
    };
    return await this.exchangeRepository.addSessionLog(exchangeId, sessionLog);
  }

  async submitPeerFeedback(exchangeId, userId, rating, comment) {
    const exchange = await this.exchangeRepository.findByExchangeId(exchangeId);
    if (!exchange) throw new Error('Exchange not found');

    const isRequester = exchange.requesterId === userId;
    const partnerId = isRequester ? exchange.recipientId : exchange.requesterId;

    const updatedExchange = await this.exchangeRepository.updateFeedback(exchangeId, { rating, comment }, isRequester);

    // Update partner reputation points
    const partner = await this.userRepository.findByUserId(partnerId);
    if (partner) {
      const newRep = Math.min(100, (partner.reputationScore || 95) + (rating >= 4 ? 2 : 0));
      await this.userRepository.updateByUserId(partnerId, {
        reputationScore: newRep,
        exchangesCompleted: (partner.exchangesCompleted || 0) + 1,
        peerReviewsCount: (partner.peerReviewsCount || 0) + 1
      });
    }

    return updatedExchange;
  }
}

export class MessageService {
  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  async getMessagesForExchange(exchangeId) {
    return await this.messageRepository.findByExchangeId(exchangeId);
  }

  async sendMessage(exchangeId, senderId, text) {
    const messageData = {
      messageId: `msg-${Date.now()}`,
      exchangeId,
      senderId,
      text,
      timestamp: new Date()
    };
    return await this.messageRepository.create(messageData);
  }
}

export class ReportService {
  constructor(safetyReportRepository) {
    this.safetyReportRepository = safetyReportRepository;
  }

  async submitReport({ reportedUserId, reportedByUserId, reason, details }) {
    const reportData = {
      reportId: `rep-${Date.now()}`,
      reportedUserId,
      reportedByUserId,
      reason,
      details,
      status: 'Open'
    };
    return await this.safetyReportRepository.create(reportData);
  }

  async getReports() {
    return await this.safetyReportRepository.findAll();
  }

  async resolveReport(reportId, status) {
    return await this.safetyReportRepository.updateStatus(reportId, status);
  }
}

export class MatchingService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.synergyStrategy = new SynergyMatchingStrategy();
  }

  async getSynergyScore(user1Id, user2Id) {
    const studentA = await this.userRepository.findByUserId(user1Id);
    const studentB = await this.userRepository.findByUserId(user2Id);
    return this.synergyStrategy.calculateSynergy(studentA, studentB);
  }
}
