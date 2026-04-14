'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AddStudentForm from '@/components/AddStudentForm';

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  rollNumber: number;
  status: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setStudents(students.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Students</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          {showForm ? '✕ Close' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AddStudentForm onSuccess={() => { setShowForm(false); fetchStudents(); }} />
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <p className="text-gray-600">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <div className="mb-4 space-y-2 text-sm">
                <p><strong>ID:</strong> {student.studentId}</p>
                <p><strong>Class:</strong> {student.class}</p>
                <p><strong>Roll No:</strong> {student.rollNumber}</p>
                <p><strong>Status:</strong> <span className={`font-bold ${student.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{student.status}</span></p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/students/${student._id}`}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded text-center hover:bg-blue-700 text-sm"
                >
                  View QR
                </Link>
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
