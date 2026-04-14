import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'present',
      enum: ['present', 'absent', 'late'],
    },
    location: {
      type: String,
      default: 'classroom',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
