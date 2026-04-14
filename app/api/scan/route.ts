import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import QRSession from '@/models/QRSession';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { qrData, sessionId } = await request.json();

    // Find student by QR code
    const student = await Student.findOne({ qrCode: qrData });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Invalid QR code' },
        { status: 404 }
      );
    }

    // Create attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = new Attendance({
      studentId: student._id,
      date: today,
      status: 'present',
      location: 'classroom',
    });

    await attendance.save();

    // Update QR session if provided
    if (sessionId) {
      await QRSession.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            scans: {
              studentId: student._id,
              qrData,
              scannedAt: new Date(),
            },
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        student: {
          name: student.name,
          studentId: student.studentId,
          class: student.class,
        },
        attendance,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
