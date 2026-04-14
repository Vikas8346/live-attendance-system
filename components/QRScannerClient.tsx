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
  const [isInitialized, setIsInitialized] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner;
    let isMounted = true;

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
          if (!isMounted) return;

          try {
            // Pause scanner
            const currentState = scanner.getState();
            if (currentState === Html5QrcodeScannerState.SCANNING) {
              await scanner.pause();
              setIsScanning(false);
            }

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
              if (isMounted && scanner) {
                const state = scanner.getState();
                if (state === Html5QrcodeScannerState.PAUSED) {
                  scanner.resume();
                  setIsScanning(true);
                }
              }
            }, 2000);
          } catch (error) {
            setScanResult({
              success: false,
              error: 'Failed to process scan',
            });
            if (isMounted && scanner) {
              const state = scanner.getState();
              if (state === Html5QrcodeScannerState.PAUSED) {
                scanner.resume();
                setIsScanning(true);
              }
            }
          }
        };

        const handleError = (error: any) => {
          // Suppress NotFoundException errors - these are normal when no QR code is detected
          // Only log actual errors (permission denied, camera not found, etc)
          const errorMessage = error?.message || error?.toString() || '';
          if (!errorMessage.includes('NotFoundException') &&
              !errorMessage.includes('No MultiFormat') &&
              !errorMessage.includes('code parse error')) {
            console.error('QR Scan error:', error);
          }
        };

        await scanner.render(handleSuccess, handleError);

        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to start scanner:', error);
        if (isMounted) {
          setScanResult({
            success: false,
            error: 'Failed to start camera. Please check permissions.',
          });
          setIsInitialized(true);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
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
    if (!scannerRef.current || !isInitialized) {
      console.warn('Scanner not ready');
      return;
    }

    try {
      const state = scannerRef.current.getState();
      if (state === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.pause();
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error pausing scanner:', error);
    }
  };

  const handleResume = async () => {
    if (!scannerRef.current || !isInitialized) {
      console.warn('Scanner not ready');
      return;
    }

    try {
      const state = scannerRef.current.getState();
      if (state === Html5QrcodeScannerState.PAUSED) {
        await scannerRef.current.resume();
        setIsScanning(true);
        setScanResult(null);
      }
    } catch (error) {
      console.error('Error resuming scanner:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">QR Code Scanner</h2>

      {!isInitialized && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
          Initializing camera... Please allow camera access if prompted.
        </div>
      )}

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
            <p>✗ Error: {scanResult.error || 'Failed to process scan'}</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {isScanning ? (
          <button
            onClick={handlePause}
            disabled={!isInitialized}
            className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏸ Pause Scanner
          </button>
        ) : (
          <button
            onClick={handleResume}
            disabled={!isInitialized}
            className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶ Resume Scanner
          </button>
        )}
      </div>
    </div>
  );
}
