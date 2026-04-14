export interface DemoStudent {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  rollNumber: number;
  status: 'active' | 'inactive';
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoAttendance {
  _id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  scannedAt: string;
}

interface AddStudentInput {
  name: string;
  email: string;
  studentId: string;
  class: string;
  rollNumber: number;
}

interface ScanResponse {
  success: boolean;
  studentName?: string;
  studentId?: string;
  class?: string;
  error?: string;
}

const STUDENTS_KEY = 'attendance-demo-students';
const ATTENDANCE_KEY = 'attendance-demo-attendance';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readJson<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeDateKey(dateLike: string) {
  return new Date(dateLike).toISOString().split('T')[0];
}

export function initializeDemoData() {
  const students = readJson<DemoStudent>(STUDENTS_KEY);

  if (students.length > 0) {
    return;
  }

  const now = new Date().toISOString();
  const seeded: DemoStudent[] = [
    {
      _id: createId(),
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      studentId: 'STU001',
      class: '10A',
      rollNumber: 1,
      status: 'active',
      qrCode: createId(),
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: createId(),
      name: 'Diya Patel',
      email: 'diya.patel@example.com',
      studentId: 'STU002',
      class: '10A',
      rollNumber: 2,
      status: 'active',
      qrCode: createId(),
      createdAt: now,
      updatedAt: now,
    },
  ];

  writeJson(STUDENTS_KEY, seeded);
  writeJson(ATTENDANCE_KEY, []);
}

export function getStudents() {
  return readJson<DemoStudent>(STUDENTS_KEY).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getStudentById(id: string) {
  const students = readJson<DemoStudent>(STUDENTS_KEY);
  return students.find((student) => student._id === id) || null;
}

export function addStudent(input: AddStudentInput) {
  const students = readJson<DemoStudent>(STUDENTS_KEY);

  const duplicateEmail = students.find(
    (student) => student.email.toLowerCase() === input.email.trim().toLowerCase()
  );

  if (duplicateEmail) {
    throw new Error('email already exists');
  }

  const duplicateStudentId = students.find(
    (student) => student.studentId.toLowerCase() === input.studentId.trim().toLowerCase()
  );

  if (duplicateStudentId) {
    throw new Error('studentId already exists');
  }

  const now = new Date().toISOString();
  const created: DemoStudent = {
    _id: createId(),
    name: input.name.trim(),
    email: input.email.trim(),
    studentId: input.studentId.trim(),
    class: input.class.trim(),
    rollNumber: input.rollNumber,
    status: 'active',
    qrCode: createId(),
    createdAt: now,
    updatedAt: now,
  };

  writeJson(STUDENTS_KEY, [created, ...students]);
  return created;
}

export function deleteStudentById(id: string) {
  const students = readJson<DemoStudent>(STUDENTS_KEY);
  const nextStudents = students.filter((student) => student._id !== id);
  writeJson(STUDENTS_KEY, nextStudents);

  const attendance = readJson<DemoAttendance>(ATTENDANCE_KEY);
  const nextAttendance = attendance.filter((record) => record.studentId !== id);
  writeJson(ATTENDANCE_KEY, nextAttendance);
}

export function processQrScan(qrData: string): ScanResponse {
  const students = readJson<DemoStudent>(STUDENTS_KEY);
  const matchedStudent = students.find((student) => student.qrCode === qrData);

  if (!matchedStudent) {
    return {
      success: false,
      error: 'Invalid QR code',
    };
  }

  const now = new Date().toISOString();
  const attendance = readJson<DemoAttendance>(ATTENDANCE_KEY);

  const nextRecord: DemoAttendance = {
    _id: createId(),
    studentId: matchedStudent._id,
    date: now,
    status: 'present',
    scannedAt: now,
  };

  writeJson(ATTENDANCE_KEY, [nextRecord, ...attendance]);

  return {
    success: true,
    studentName: matchedStudent.name,
    studentId: matchedStudent.studentId,
    class: matchedStudent.class,
  };
}

export function getAttendanceByDate(selectedDate?: string) {
  const attendance = readJson<DemoAttendance>(ATTENDANCE_KEY);
  const students = readJson<DemoStudent>(STUDENTS_KEY);

  return attendance
    .filter((record) => {
      if (!selectedDate) {
        return true;
      }

      return normalizeDateKey(record.date) === selectedDate;
    })
    .map((record) => {
      const student = students.find((item) => item._id === record.studentId);
      return {
        _id: record._id,
        studentId: {
          _id: student?._id || '',
          name: student?.name || 'Unknown',
          studentId: student?.studentId || 'Unknown',
          class: student?.class || 'Unknown',
        },
        date: record.date,
        status: record.status,
        scannedAt: record.scannedAt,
      };
    })
    .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
}

export function getDashboardStats() {
  const students = readJson<DemoStudent>(STUDENTS_KEY);
  const attendance = readJson<DemoAttendance>(ATTENDANCE_KEY);

  const todayKey = normalizeDateKey(new Date().toISOString());
  const presentToday = attendance.filter((record) => normalizeDateKey(record.date) === todayKey).length;

  return {
    totalStudents: students.length,
    totalAttendance: attendance.length,
    presentToday,
  };
}
