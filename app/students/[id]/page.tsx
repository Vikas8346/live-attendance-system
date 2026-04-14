'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRDisplay from '@/components/QRDisplay';
import Link from 'next/link';

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  rollNumber: number;
  qrDataUrl: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        const data = await response.json();
        if (data.success) {
          setStudent(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Student not found</p>
        <Link href="/students" className="text-blue-600 hover:text-blue-800">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/students" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Students
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{student.name}</h1>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Student ID:</strong> {student.studentId}
            </p>
            <p>
              <strong>Class:</strong> {student.class}
            </p>
            <p>
              <strong>Roll Number:</strong> {student.rollNumber}
            </p>
          </div>
        </div>

        <QRDisplay
          qrDataUrl={student.qrDataUrl}
          studentName={student.name}
          studentId={student.studentId}
        />
      </div>
    </div>
  );
}
