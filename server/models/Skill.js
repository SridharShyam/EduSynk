import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  skillId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  popular: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

export const Skill = mongoose.model('Skill', skillSchema);
