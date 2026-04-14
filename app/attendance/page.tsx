'use client';

import { useEffect, useState } from 'react';

interface AttendanceRecord {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    studentId: string;
    class: string;
  };
  date: string;
  status: string;
  scannedAt: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('date', selectedDate);
      }
      const response = await fetch(`/api/attendance?${params}`);
      const data = await response.json();
      setAttendance(data.data || []);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAttendance();
  }, [selectedDate]);

  const filteredAttendance = selectedClass
    ? attendance.filter((record) => record.studentId.class === selectedClass)
    : attendance;

  const classes = [...new Set(attendance.map((record) => record.studentId.class))];
  const presentCount = filteredAttendance.filter((r) => r.status === 'present').length;
  const absentCount = filteredAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = filteredAttendance.filter((r) => r.status === 'late').length;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Attendance Records</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Present</p>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Absent</p>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-gray-600 text-sm">Late</p>
            <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredAttendance.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <p className="text-gray-600">No attendance records found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Student ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Class</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Scanned At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-800">{record.studentId.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{record.studentId.studentId}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{record.studentId.class}</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(record.scannedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
