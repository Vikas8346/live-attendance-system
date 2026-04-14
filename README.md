# Live Attendance System - QR Code Based

A modern, full-stack attendance tracking system built with **Next.js**, **MongoDB**, and **TypeScript**. Students can be marked present by scanning their unique QR codes.

## ✨ Features

- **Student Management**: Add, view, and manage students with unique QR codes
- **QR Code Generation**: Automatically generate QR codes for each student
- **Real-time Scanning**: Live QR code scanning using webcam/camera
- **Attendance Tracking**: Record and view attendance records
- **Dashboard**: Overview of total students, attendance records, and daily present count
- **Search & Filter**: Search students by name or ID, filter attendance by class and date
- **Print QR Codes**: Print student QR codes for physical distribution
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **QR Code**: qrcode library for generation, html5-qrcode for scanning
- **UUID**: Unique identifier generation for QR codes

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- Modern browser with camera support for QR scanning

## 🚀 Installation

1. **Clone and Setup**
   ```bash
   cd live-attendance-system
   npm install
   ```

2. **Configure Environment Variables**
   
   Create or update `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/attendance-system
   NEXT_PUBLIC_APP_NAME=Live Attendance System
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Or run MongoDB in Docker
   docker run -d -p 27017:27017 mongo
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
live-attendance-system/
├── app/
│   ├── api/
│   │   ├── students/          # Student CRUD operations
│   │   ├── attendance/        # Attendance records
│   │   └── scan/              # QR scan processing
│   ├── students/              # Student pages
│   ├── scan/                  # Scanner page
│   ├── attendance/            # Attendance view page
│   ├── layout.tsx             # Root layout with Navbar
│   ├── page.tsx               # Dashboard
│   └── globals.css
├── components/
│   ├── Navbar.tsx             # Navigation bar
│   ├── AddStudentForm.tsx     # Student creation form
│   ├── QRDisplay.tsx          # QR code display & print
│   └── QRScannerClient.tsx    # Real-time QR scanner
├── lib/
│   └── mongodb.ts             # MongoDB connection
├── models/
│   ├── Student.ts             # Student schema
│   ├── Attendance.ts          # Attendance schema
│   └── QRSession.ts           # QR session schema
├── public/
├── .env.local                 # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Usage Guide

### 1. Add Students

1. Navigate to **Students** page
2. Click **"+ Add Student"** button
3. Fill in student details:
   - Full Name
   - Email
   - Student ID
   - Class
   - Roll Number
4. Click **"Add Student"** - a unique QR code is automatically generated

### 2. View & Print QR Codes

1. Go to **Students** page
2. Click **"View QR"** on any student card
3. View the QR code with student details
4. Click **"🖨️ Print QR Code"** to print

### 3. Mark Attendance by Scanning

1. Navigate to **Scan QR** page
2. Allow camera access when prompted
3. Point camera at student's QR code
4. System automatically records attendance
5. View recent scans in the sidebar

### 4. View Attendance Records

1. Go to **Attendance** page
2. Select date to filter records
3. Optionally filter by class
4. View statistics (Present, Absent, Late)
5. See detailed attendance table

### 5. Dashboard Overview

- View total students count
- See total attendance records
- Check how many students are present today
- Quick access to all major features

## 🔌 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student details with QR
- `DELETE /api/students/[id]` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance records (supports filtering)
- `POST /api/attendance` - Create attendance record
- `POST /api/scan` - Process QR code scan

## 🗄️ Database Schema

### Student
```javascript
{
  name: String,
  email: String (unique),
  studentId: String (unique),
  qrCode: String (unique),
  class: String,
  rollNumber: Number,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance
```javascript
{
  studentId: ObjectId,
  date: Date,
  scannedAt: Date,
  status: String (present/absent/late),
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Customization

### Change Colors
Edit Tailwind classes in components or update `tailwind.config.ts`:
```javascript
theme: {
  colors: {
    // Custom colors
  }
}
```

### Modify QR Code Properties
Edit `/app/api/students/[id]/route.ts`:
```javascript
const qrDataUrl = await QRCode.toDataURL(student.qrCode, {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 1,
  width: 300,  // Change size
});
```

## 🐛 Troubleshooting

### Camera Not Working
- Check browser camera permissions
- Use HTTPS in production
- Test with different browser

### MongoDB Connection Failed
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Ensure network connectivity

### QR Scanner Not Scanning
- Ensure good lighting
- Use clear, undamaged QR codes
- Check browser console for errors

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables for Production
Set these in your hosting platform:
- `MONGODB_URI` - Production MongoDB connection string
- `NEXT_PUBLIC_APP_URL` - Your app's public URL

## 📦 Dependencies

- `next` - React framework
- `mongoose` - MongoDB ODM
- `qrcode` - QR code generation
- `html5-qrcode` - Browser QR scanning
- `uuid` - Unique ID generation
- `tailwindcss` - Utility-first CSS

## 🔒 Security Notes

- Never expose `MONGODB_URI` in client-side code
- Use HTTPS in production
- Implement authentication for production
- Validate all user inputs
- Consider rate limiting for API endpoints

## 📝 Future Enhancements

- [ ] User authentication (admin/teacher roles)
- [ ] Batch QR code generation
- [ ] Attendance reports and exports
- [ ] Class schedule management
- [ ] Parent notifications
- [ ] Real-time dashboard updates
- [ ] Mobile app (React Native)
- [ ] Biometric attendance option

## 💡 Tips

- Generate QR codes in bulk before class
- Laminate printed codes for durability
- Use class names like "10A", "10B" for easy filtering
- Regular database backups recommended
- Monitor API response times in production

## 🤝 Contributing

Feel free to fork and submit pull requests for improvements.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors

---

**Built with ❤️ for efficient attendance tracking**
