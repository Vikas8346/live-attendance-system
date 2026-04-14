import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/models/Student';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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

    // Generate unique QR code value
    const qrValue = uuidv4();

    const newStudent = new Student({
      name,
      email,
      studentId,
      qrCode: qrValue,
      class: className,
      rollNumber,
    });

    const savedStudent = await newStudent.save();

    return NextResponse.json(
      { success: true, data: savedStudent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
