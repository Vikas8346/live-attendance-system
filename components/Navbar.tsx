'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            📋 Attendance System
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700"
          >
            <svg
              className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-6">
            <li>
              <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/students" className="hover:bg-blue-700 px-3 py-2 rounded">
                Students
              </Link>
            </li>
            <li>
              <Link href="/scan" className="hover:bg-blue-700 px-3 py-2 rounded">
                Scan QR
              </Link>
            </li>
            <li>
              <Link href="/attendance" className="hover:bg-blue-700 px-3 py-2 rounded">
                Attendance
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block px-3 py-2 hover:bg-blue-700 rounded">
              Dashboard
            </Link>
            <Link href="/students" className="block px-3 py-2 hover:bg-blue-700 rounded">
              Students
            </Link>
            <Link href="/scan" className="block px-3 py-2 hover:bg-blue-700 rounded">
              Scan QR
            </Link>
            <Link href="/attendance" className="block px-3 py-2 hover:bg-blue-700 rounded">
              Attendance
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
