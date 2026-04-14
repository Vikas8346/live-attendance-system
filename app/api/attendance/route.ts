import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import Student from '@/models/Student';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { studentId, date, status, location } = await request.json();

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    const attendance = new Attendance({
      studentId,
      date: new Date(date),
      status: status || 'present',
      location: location || 'classroom',
    });

    const savedAttendance = await attendance.save();

    return NextResponse.json(
      { success: true, data: savedAttendance },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');

    let query: Record<string, unknown> = {};

    if (studentId) {
      query.studentId = studentId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId')
      .lean();

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
