# Quick Start Guide - MySQL to MongoDB Migration

## ✅ What's Been Done
All **29 TypeScript files** in your Angular frontend now point to `http://localhost:8080` instead of the Render URL.

## 🚀 Next Steps (In Order)

### Step 1: Set Up MongoDB (Choose One)

#### Option A: MongoDB Atlas (Cloud - Recommended)
```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0)
4. Create database user (username + password)
5. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get connection string:
   mongodb+srv://<username>:<password>@cluster.mongodb.net/environmental_health_wil
```

#### Option B: Local MongoDB
```powershell
# Install MongoDB
choco install mongodb

# Start MongoDB service
net start MongoDB

# Test connection
mongosh
```

---

### Step 2: Create Node.js Backend

```powershell
# Navigate to your project
cd c:\xampp\htdocs\environmental-health-wil-frontend

# Create backend folder
mkdir api
cd api

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken multer
npm install --save-dev typescript @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

---

### Step 3: Create Basic Backend Structure

```powershell
# Create folder structure
mkdir src
mkdir src\models
mkdir src\routes
mkdir src\controllers
mkdir src\middleware
mkdir src\config
```

**Create `.env` file:**
```env
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/environmental_health_wil
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

### Step 4: Create Minimal Working Backend

**`src/server.ts`:**
```typescript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
```

---

### Step 5: Test the Setup

```powershell
# Terminal 1: Start Backend
cd api
npm run dev

# Terminal 2: Start Angular Frontend
cd c:\xampp\htdocs\environmental-health-wil-frontend
ng serve

# Terminal 3: Test Backend
curl http://localhost:8080/api/health
```

**Expected Output:**
```json
{
  "status": "OK",
  "message": "Backend is running!"
}
```

---

### Step 6: Implement Your First API Endpoint

**Example: Get Student by Number**

**`src/models/Student.ts`:**
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  student_number: string;
  first_names: string;
  surname: string;
  email: string;
  level_of_study: number;
  // Add other fields from your MySQL schema
}

const StudentSchema = new Schema({
  student_number: { type: String, required: true, unique: true },
  first_names: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  level_of_study: { type: Number, required: true },
  // Add other fields
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
```

**`src/routes/students.ts`:**
```typescript
import express from 'express';
import Student from '../models/Student';

const router = express.Router();

// GET /api/student/:studentNumber
router.get('/student/:studentNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ 
      student_number: req.params.studentNumber 
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      fullName: `${student.first_names} ${student.surname}`,
      levelOfStudy: student.level_of_study,
      ...student.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
```

**Update `src/server.ts`:**
```typescript
import studentRoutes from './routes/students';

// ... existing code ...

app.use('/api', studentRoutes);
```

---

## 📊 Migration Checklist

- [ ] MongoDB set up (Atlas or Local)
- [ ] Node.js backend created
- [ ] Basic server running on port 8080
- [ ] Test endpoint working
- [ ] Student model created
- [ ] Student routes implemented
- [ ] Logsheet model created
- [ ] Logsheet routes implemented
- [ ] Auth routes implemented
- [ ] Data migrated from MySQL
- [ ] All endpoints tested with Postman
- [ ] Frontend tested with backend
- [ ] Deploy backend to production
- [ ] Update frontend environment.prod.ts
- [ ] Deploy frontend

---

## 🔍 Verify Everything Works

1. **Backend Health Check:**
   ```powershell
   curl http://localhost:8080/api/health
   ```

2. **Frontend Connection:**
   - Open browser: http://localhost:4200
   - Open DevTools Console (F12)
   - Check for API calls to localhost:8080
   - Verify no CORS errors

3. **MongoDB Connection:**
   ```powershell
   # Check backend logs for:
   # ✅ Connected to MongoDB
   ```

---

## 🆘 Common Issues

### Backend won't start
```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <PID> /F
```

### MongoDB connection fails
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas IP whitelist includes your IP
- Test connection string with `mongosh`

### CORS errors in browser
- Ensure backend has `cors({ origin: 'http://localhost:4200' })`
- Check backend logs for incoming requests

---

## 📁 Files Created/Modified

### Created:
- `MIGRATION-SUMMARY.md` - Full migration guide
- `QUICK-START.md` - This file
- `update-urls.ps1` - URL replacement script (can delete)
- `fix-urls.ps1` - URL fix script (can delete)
- `cleanup-backticks.ps1` - Cleanup script (can delete)

### Modified:
- 29 TypeScript files (all Render URLs → localhost:8080)

---

## 📞 Need Help?

Refer to `MIGRATION-SUMMARY.md` for detailed instructions on:
- MongoDB schema design
- Complete API endpoint list
- Data migration strategies
- Deployment guides

**Current Status:** ✅ Frontend ready | ⏳ Backend needs creation
