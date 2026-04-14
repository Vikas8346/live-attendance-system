# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
Choose one of the following:

**Option A: Docker (Easiest)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option B: Local Installation**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 3. Configure Environment
Your `.env.local` is already configured for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/attendance-system
```

### 4. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** 🚀

---

## First Steps

### Add Your First Student
1. Click **"+ Add Student"** on the Students page
2. Fill in the form with test data:
   - Name: John Doe
   - Email: john@example.com
   - Student ID: STU001
   - Class: 10A
   - Roll Number: 1
3. Click **"Add Student"**

### View & Print QR Code
1. See John Doe's card on the Students page
2. Click **"View QR"** button
3. Click **"🖨️ Print QR Code"** to print

### Test QR Scanning
1. Go to **"Scan QR"** page
2. Click on the QR code generator to create a test QR code with value: `<uuid>`
3. Scan it with your camera
4. Watch attendance get recorded!

---

## Common Issues

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### MongoDB Connection Error
```
MongoServerSelectionError: connect ECONNREFUSED
```
→ Make sure MongoDB is running. Check with: `curl localhost:27017`

### Camera Permission Denied
→ Grant camera permission in your browser settings

### TypeScript Complaining
```bash
# Clear cache and rebuild
npm run build --force
```

---

## Next Steps

- Add more students
- Scan QR codes in attendance mode
- Check attendance records with filters
- Export data (feature coming soon!)

Happy tracking! 📊
