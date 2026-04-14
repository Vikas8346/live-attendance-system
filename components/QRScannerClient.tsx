'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';

interface ScanResult {
  success: boolean;
  studentName?: string;
  studentId?: string;
  class?: string;
  error?: string;
}

interface QRScannerClientProps {
  onScan?: (result: ScanResult) => void;
}

export default function QRScannerClient({ onScan }: QRScannerClientProps) {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner;

    const startScanner = async () => {
      try {
        scanner = new Html5QrcodeScanner(
          'qr-scanner',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          false
        );

        scannerRef.current = scanner;

        const handleSuccess = async (decodedText: string) => {
          // Stop scanning after first successful scan
          if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            scanner.pause();
            setIsScanning(false);
          }

          try {
            const response = await fetch('/api/scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ qrData: decodedText }),
            });

            const data = await response.json();

            const result: ScanResult = {
              success: data.success,
              studentName: data.data?.student?.name,
              studentId: data.data?.student?.studentId,
              class: data.data?.student?.class,
              error: data.error,
            };

            setScanResult(result);
            onScan?.(result);

            // Resume after 2 seconds
            setTimeout(() => {
              if (scanner) {
                scanner.resume();
                setIsScanning(true);
              }
            }, 2000);
          } catch (error) {
            setScanResult({
              success: false,
              error: 'Failed to process scan',
            });
            if (scanner) {
              scanner.resume();
              setIsScanning(true);
            }
          }
        };

        const handleError = (error: any) => {
          console.error('QR Scan error:', error);
        };

        await scanner.render(handleSuccess, handleError);
      } catch (error) {
        console.error('Failed to start scanner:', error);
        setScanResult({
          success: false,
          error: 'Failed to start camera. Please check permissions.',
        });
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error('Error clearing scanner:', error);
        }
      }
    };
  }, [onScan]);

  const handlePause = async () => {
    if (scannerRef.current) {
      await scannerRef.current.pause();
      setIsScanning(false);
    }
  };

  const handleResume = async () => {
    if (scannerRef.current) {
      await scannerRef.current.resume();
      setIsScanning(true);
      setScanResult(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">QR Code Scanner</h2>

      <div id="qr-scanner" className="w-full mb-4"></div>

      {scanResult && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            scanResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {scanResult.success ? (
            <div>
              <p className="font-bold">✓ Attendance Recorded</p>
              <p className="mt-2">Student: {scanResult.studentName}</p>
              <p>ID: {scanResult.studentId}</p>
              <p>Class: {scanResult.class}</p>
            </div>
          ) : (
            <p>✗ Error: {scanResult.error}</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {isScanning ? (
          <button
            onClick={handlePause}
            className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
          >
            ⏸ Pause Scanner
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
          >
            ▶ Resume Scanner
          </button>
        )}
      </div>
    </div>
  );
}
