import mongoose from 'mongoose';

const safetyReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  reportedUserId: { type: String, required: true },
  reportedByUserId: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Resolved', 'Dismissed'], default: 'Open' }
}, { timestamps: true });

export const SafetyReport = mongoose.model('SafetyReport', safetyReportSchema);
