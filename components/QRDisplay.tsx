'use client';

import { useEffect, useRef } from 'react';

interface QRDisplayProps {
  qrDataUrl: string;
  studentName: string;
  studentId: string;
}

export default function QRDisplay({ qrDataUrl, studentName, studentId }: QRDisplayProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=400,width=400');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
        printWindow.document.write(`<h2>${studentName}</h2>`);
        printWindow.document.write(`<p>ID: ${studentId}</p>`);
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div ref={printRef}>
        <h3 className="text-xl font-bold mb-2">{studentName}</h3>
        <p className="text-gray-600 mb-4">ID: {studentId}</p>
        <img src={qrDataUrl} alt="QR Code" className="mx-auto" />
      </div>
      <button
        onClick={handlePrint}
        className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
      >
        🖨️ Print QR Code
      </button>
    </div>
  );
}
