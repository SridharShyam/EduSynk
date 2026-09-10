import mongoose from 'mongoose';

const teachSkillSchema = new mongoose.Schema({
  skillId: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  yearsExp: { type: Number, default: 1 },
  notes: { type: String, default: '' }
}, { _id: false });

const learnSkillSchema = new mongoose.Schema({
  skillId: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  targetGoal: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Custom student ID (e.g. 'user-1')
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  university: { type: String, required: true },
  major: { type: String, required: true },
  bio: { type: String, default: '' },
  languages: [{ type: String }],
  availability: { type: String, default: 'Flexible Schedule' },
  preferredFormat: { type: String, default: 'Online Live Sessions' },
  reputationScore: { type: Number, default: 95 },
  exchangesCompleted: { type: Number, default: 0 },
  milestonesAchieved: { type: Number, default: 0 },
  peerReviewsCount: { type: Number, default: 0 },
  verifiedBadge: { type: String, default: 'Verified Peer Scholar' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  teachSkills: [teachSkillSchema],
  learnSkills: [learnSkillSchema]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
