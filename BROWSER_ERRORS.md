# Browser Console Errors - Solution Guide

## 1. MetaMask "Failed to connect" Error

**What it is:** A browser extension (MetaMask or similar crypto wallet) trying to inject code into your app.

**Solution (Choose one):**

### Option A: Disable in Browser (Quickest)
1. Chrome: Click extension icon → "Manage extensions"
2. Find MetaMask or similar crypto extensions
3. Toggle OFF or remove

### Option B: Use Incognito/Private Mode
Open your app in a private/incognito window where extensions are disabled

### Option C: Ignore It (Safe)
This error doesn't affect your attendance system at all - it's just a failed background injection.

---

## 2. WebSocket Connection Error for HMR

**What it is:** Hot Module Replacement (development feature) having trouble connecting.

**Solutions:**

### Quick Fix
```bash
# Stop dev server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
npm run dev
```

### If Issue Persists

Edit `.env.local` and add:
```env
MONGODB_URI=mongodb://localhost:27017/attendance-system
NEXT_PUBLIC_APP_NAME=Live Attendance System
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add these for HMR fix:
WEBPACK_BUNDLE_ANALYZER=false
NODE_OPTIONS=--max-old-space-size=4096
```

### For Production
These errors **only appear in development mode**. The production build (`npm run build` and `npm start`) won't show these errors.

---

## Verification

✅ **The App Works Fine If:**
- Pages load correctly
- You can add students
- QR codes scan properly
- Attendance records appear

❌ **These Errors Only Affect:**
- Hot reload (page refresh still works)
- Browser console appearance (visual only)
- Development experience

---

## To Run Clean

```bash
# Option 1: Full clean rebuild
npm run build
npm start

# Option 2: Clear dev cache
rm -rf .next
npm run dev

# Option 3: Use different port
npm run dev -- -p 3001
```

**Your attendance system works perfectly regardless of these console errors!** 🚀
