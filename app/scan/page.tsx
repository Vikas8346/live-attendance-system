'use client';

import { useState } from 'react';
import QRScannerClient from '@/components/QRScannerClient';

interface ScanLog {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  timestamp: string;
}

interface ScanResult {
  success: boolean;
  studentName?: string;
  studentId?: string;
  class?: string;
}

export default function ScanPage() {
  const [scans, setScans] = useState<ScanLog[]>([]);

  const handleScan = (result: ScanResult) => {
    if (result.success) {
      const scan: ScanLog = {
        id: Date.now().toString(),
        studentName: result.studentName || 'Unknown',
        studentId: result.studentId || 'Unknown',
        class: result.class || 'Unknown',
        timestamp: new Date().toLocaleTimeString(),
      };
      setScans((prev) => [scan, ...prev.slice(0, 9)]);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Attendance Scanner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QRScannerClient onScan={handleScan} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Scans</h2>
          {scans.length === 0 ? (
            <p className="text-gray-600">No scans yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scans.map((scan) => (
                <div key={scan.id} className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p className="font-bold text-sm text-gray-800">{scan.studentName}</p>
                  <p className="text-xs text-gray-600">ID: {scan.studentId}</p>
                  <p className="text-xs text-gray-600">Class: {scan.class}</p>
                  <p className="text-xs text-gray-500 mt-1">{scan.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
