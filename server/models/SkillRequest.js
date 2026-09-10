import mongoose from 'mongoose';

const skillRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  skillName: { type: String, required: true },
  category: { type: String, required: true },
  requestedBy: { type: String, required: true },
  upvotes: { type: Number, default: 1 },
  status: { type: String, enum: ['Under Review', 'Approved', 'Rejected'], default: 'Under Review' }
}, { timestamps: true });

export const SkillRequest = mongoose.model('SkillRequest', skillRequestSchema);
