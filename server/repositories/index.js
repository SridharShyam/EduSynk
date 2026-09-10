import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Exchange } from '../models/Exchange.js';
import { Message } from '../models/Message.js';
import { SkillRequest } from '../models/SkillRequest.js';
import { SafetyReport } from '../models/SafetyReport.js';

export class UserRepository {
  async findAll() {
    return await User.find().lean();
  }

  async findByUserId(userId) {
    return await User.findOne({ userId }).lean();
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateByUserId(userId, updateData) {
    return await User.findOneAndUpdate({ userId }, updateData, { new: true }).lean();
  }
}

export class SkillRepository {
  async findAll() {
    return await Skill.find().lean();
  }

  async findBySkillId(skillId) {
    return await Skill.findOne({ skillId }).lean();
  }

  async create(skillData) {
    const skill = new Skill(skillData);
    return await skill.save();
  }
}

export class ExchangeRepository {
  async findAll() {
    return await Exchange.find().sort({ createdAt: -1 }).lean();
  }

  async findByExchangeId(exchangeId) {
    return await Exchange.findOne({ exchangeId });
  }

  async findByParticipant(userId) {
    return await Exchange.find({
      $or: [{ requesterId: userId }, { recipientId: userId }]
    }).sort({ createdAt: -1 }).lean();
  }

  async findExistingActiveOrPending(user1Id, user2Id) {
    return await Exchange.findOne({
      $or: [
        { requesterId: user1Id, recipientId: user2Id },
        { requesterId: user2Id, recipientId: user1Id }
      ],
      status: { $in: ['Pending', 'Active'] }
    });
  }

  async create(exchangeData) {
    const exchange = new Exchange(exchangeData);
    return await exchange.save();
  }

  async updateStatus(exchangeId, status) {
    return await Exchange.findOneAndUpdate({ exchangeId }, { status }, { new: true });
  }

  async addMilestone(exchangeId, milestone) {
    return await Exchange.findOneAndUpdate(
      { exchangeId },
      { $push: { milestones: milestone } },
      { new: true }
    );
  }

  async toggleMilestone(exchangeId, milestoneId) {
    const exchange = await Exchange.findOne({ exchangeId });
    if (!exchange) return null;
    
    exchange.milestones = exchange.milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m.toObject(),
          completed: !m.completed,
          date: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    });

    return await exchange.save();
  }

  async addSessionLog(exchangeId, sessionLog) {
    return await Exchange.findOneAndUpdate(
      { exchangeId },
      { $push: { sessionLogs: { $each: [sessionLog], $position: 0 } } },
      { new: true }
    );
  }

  async updateFeedback(exchangeId, feedbackData, isRequester) {
    const update = isRequester
      ? { 'feedback.user1Rating': feedbackData.rating, 'feedback.user1Comment': feedbackData.comment }
      : { 'feedback.user2Rating': feedbackData.rating, 'feedback.user2Comment': feedbackData.comment };

    return await Exchange.findOneAndUpdate({ exchangeId }, { $set: update }, { new: true });
  }
}

export class MessageRepository {
  async findByExchangeId(exchangeId) {
    return await Message.find({ exchangeId }).sort({ timestamp: 1 }).lean();
  }

  async create(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }
}

export class SkillRequestRepository {
  async findAll() {
    return await SkillRequest.find().sort({ upvotes: -1 }).lean();
  }

  async create(requestData) {
    const req = new SkillRequest(requestData);
    return await req.save();
  }

  async upvote(requestId) {
    return await SkillRequest.findOneAndUpdate(
      { requestId },
      { $inc: { upvotes: 1 } },
      { new: true }
    );
  }

  async updateStatus(requestId, status) {
    return await SkillRequest.findOneAndUpdate({ requestId }, { status }, { new: true });
  }
}

export class SafetyReportRepository {
  async findAll() {
    return await SafetyReport.find().sort({ createdAt: -1 }).lean();
  }

  async create(reportData) {
    const report = new SafetyReport(reportData);
    return await report.save();
  }

  async updateStatus(reportId, status) {
    return await SafetyReport.findOneAndUpdate({ reportId }, { status }, { new: true });
  }
}
