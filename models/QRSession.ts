import mongoose from 'mongoose';

const QRSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scans: [
      {
        studentId: mongoose.Schema.Types.ObjectId,
        qrData: String,
        scannedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.QRSession || mongoose.model('QRSession', QRSessionSchema);
