'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalStudents: number;
  totalAttendance: number;
  presentToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalAttendance: 0,
    presentToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/attendance'),
        ]);

        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const presentToday = attendanceData.data?.filter((record: any) => {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);
          return recordDate.getTime() === today.getTime();
        }).length || 0;

        setStats({
          totalStudents: studentsData.data?.length || 0,
          totalAttendance: attendanceData.data?.length || 0,
          presentToday,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Students</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Attendance Records</h2>
          <p className="text-4xl font-bold text-green-600">{stats.totalAttendance}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm font-semibold uppercase mb-2">Present Today</h2>
          <p className="text-4xl font-bold text-purple-600">{stats.presentToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/students" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition">
          <h3 className="text-2xl font-bold mb-2">👥 Manage Students</h3>
          <p>Add, view, and manage student QR codes</p>
        </Link>
        <Link href="/scan" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition">
          <h3 className="text-2xl font-bold mb-2">📱 Scan QR Code</h3>
          <p>Mark attendance by scanning student QR codes</p>
        </Link>
        <Link href="/attendance" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition">
          <h3 className="text-2xl font-bold mb-2">📊 View Attendance</h3>
          <p>Check attendance records and reports</p>
        </Link>
      </div>
    </div>
  );
}
