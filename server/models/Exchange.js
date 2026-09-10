import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedBy: { type: String },
  assignedTo: { type: String },
  date: { type: String }
}, { _id: false });

const sessionLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  topic: { type: String, required: true },
  notes: { type: String, default: '' },
  videoLink: { type: String, default: '' }
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  user1Rating: { type: Number },
  user1Comment: { type: String },
  user2Rating: { type: Number },
  user2Comment: { type: String }
}, { _id: false });

const exchangeSchema = new mongoose.Schema({
  exchangeId: { type: String, required: true, unique: true },
  requesterId: { type: String, required: true },
  recipientId: { type: String, required: true },
  offeredSkillId: { type: String, required: true },
  requestedSkillId: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Active', 'Paused', 'Completed', 'Declined', 'Cancelled'],
    default: 'Pending'
  },
  format: { type: String, required: true },
  proposedHoursPerWeek: { type: Number, default: 2 },
  reciprocalAgreement: { type: String, required: true },
  milestones: [milestoneSchema],
  sessionLogs: [sessionLogSchema],
  feedback: feedbackSchema
}, { timestamps: true });

export const Exchange = mongoose.model('Exchange', exchangeSchema);
