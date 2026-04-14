import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'live_attendance_system';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is missing in .env.local');
}

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    rollNumber: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

async function runSeed() {
  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10000,
  });

  const sampleStudent = {
    name: 'Sample Student',
    email: 'sample.student@example.com',
    studentId: 'STU-SAMPLE-001',
    qrCode: 'sample-qr-live-attendance-001',
    class: '10A',
    rollNumber: 1,
    status: 'active',
  };

  const existing = await Student.findOne({
    $or: [
      { email: sampleStudent.email },
      { studentId: sampleStudent.studentId },
      { qrCode: sampleStudent.qrCode },
    ],
  });

  if (existing) {
    console.log('Seed skipped: sample student already exists.');
  } else {
    await Student.create(sampleStudent);
    console.log('Seed success: sample student created.');
  }

  const count = await Student.countDocuments({});
  console.log(`Total students in database: ${count}`);
  await mongoose.disconnect();
}

runSeed().catch(async (error) => {
  console.error('Seed failed:', error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exit(1);
});
