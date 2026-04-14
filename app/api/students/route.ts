import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({}).lean();
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name, email, studentId, class: className, rollNumber } = await request.json();

    if (!name || !email || !studentId || !className || Number.isNaN(Number(rollNumber))) {
      return NextResponse.json(
        { success: false, error: 'name, email, studentId, class and valid rollNumber are required' },
        { status: 400 }
      );
    }

    // Generate unique QR code value
    const qrValue = uuidv4();

    const newStudent = new Student({
      name,
      email,
      studentId,
      qrCode: qrValue,
      class: className,
      rollNumber: Number(rollNumber),
    });

    const savedStudent = await newStudent.save();

    return NextResponse.json(
      { success: true, data: savedStudent },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    ) {
      const duplicateField = Object.keys((error as { keyPattern?: Record<string, unknown> }).keyPattern || {})[0] || 'field';
      return NextResponse.json(
        { success: false, error: `${duplicateField} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
