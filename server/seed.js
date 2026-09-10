import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Skill } from './models/Skill.js';
import { Exchange } from './models/Exchange.js';
import { Message } from './models/Message.js';
import { SkillRequest } from './models/SkillRequest.js';
import { SafetyReport } from './models/SafetyReport.js';
import { INITIAL_SKILLS, INITIAL_STUDENTS, INITIAL_EXCHANGES, INITIAL_MESSAGES, INITIAL_SKILL_REQUESTS, INITIAL_SAFETY_REPORTS } from '../src/data/initialData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/WEBCRAFT';
    console.log(`[Seeder] Connecting to MongoDB WEBCRAFT Database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Clearing old collection documents...');
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Exchange.deleteMany({});
    await Message.deleteMany({});
    await SkillRequest.deleteMany({});
    await SafetyReport.deleteMany({});

    console.log('[Seeder] Hashing student test passwords & populating Users collection...');
    const salt = await bcrypt.genSalt(10);

    const userDocs = await Promise.all(INITIAL_STUDENTS.map(async (student) => {
      const passwordPlain = `${student.name.split(' ')[0].toLowerCase()}123`; // e.g. alex123, maya123
      const hashedPassword = await bcrypt.hash(passwordPlain, salt);
      return {
        userId: student.id,
        name: student.name,
        email: `${student.name.split(' ')[0].toLowerCase()}@university.edu`,
        password: hashedPassword,
        avatar: student.avatar,
        university: student.university,
        major: student.major,
        bio: student.bio,
        languages: student.languages,
        availability: student.availability,
        preferredFormat: student.preferredFormat,
        reputationScore: student.reputationScore,
        exchangesCompleted: student.exchangesCompleted,
        milestonesAchieved: student.milestonesAchieved,
        peerReviewsCount: student.peerReviewsCount,
        verifiedBadge: student.verifiedBadge,
        role: 'student',
        teachSkills: student.teachSkills,
        learnSkills: student.learnSkills
      };
    }));

    // Add Admin Persona
    const adminHashed = await bcrypt.hash('admin123', salt);
    userDocs.push({
      userId: 'admin',
      name: 'System Admin',
      email: 'admin@webcraft.edu',
      password: adminHashed,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      university: 'WEBCRAFT Moderation Board',
      major: 'Platform Health & Moderation Manager',
      bio: 'Platform safety, moderation & taxonomy manager',
      role: 'admin',
      reputationScore: 100,
      teachSkills: [],
      learnSkills: []
    });

    await User.insertMany(userDocs);

    console.log('[Seeder] Populating Skills collection...');
    await Skill.insertMany(INITIAL_SKILLS.map(s => ({
      skillId: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      popular: s.popular,
      tags: s.tags
    })));

    console.log('[Seeder] Populating Exchanges collection...');
    await Exchange.insertMany(INITIAL_EXCHANGES.map(ex => ({
      exchangeId: ex.id,
      requesterId: ex.requesterId,
      recipientId: ex.recipientId,
      offeredSkillId: ex.offeredSkillId,
      requestedSkillId: ex.requestedSkillId,
      status: ex.status,
      format: ex.format,
      proposedHoursPerWeek: ex.proposedHoursPerWeek,
      reciprocalAgreement: ex.reciprocalAgreement,
      milestones: ex.milestones,
      sessionLogs: ex.sessionLogs,
      feedback: ex.feedback
    })));

    console.log('[Seeder] Populating Messages collection...');
    await Message.insertMany(INITIAL_MESSAGES.map(m => ({
      messageId: m.id,
      exchangeId: m.exchangeId,
      senderId: m.senderId,
      text: m.text,
      timestamp: new Date(m.timestamp)
    })));

    console.log('[Seeder] Populating Skill Requests collection...');
    await SkillRequest.insertMany(INITIAL_SKILL_REQUESTS.map(sr => ({
      requestId: sr.id,
      skillName: sr.skillName,
      category: sr.category,
      requestedBy: sr.requestedBy,
      upvotes: sr.upvotes,
      status: sr.status
    })));

    console.log('[Seeder] Populating Safety Reports collection...');
    await SafetyReport.insertMany(INITIAL_SAFETY_REPORTS.map(rep => ({
      reportId: rep.id,
      reportedUserId: rep.reportedUserId,
      reportedByUserId: rep.reportedByUserId,
      reason: rep.reason,
      details: rep.details,
      status: rep.status
    })));

    console.log('✅ [Seeder] WEBCRAFT Database successfully seeded in MongoDB!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ [Seeder] Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
