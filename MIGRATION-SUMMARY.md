# MySQL to MongoDB Migration - Frontend URL Update Summary

## ✅ Completed Actions

### 1. **All Render URLs Replaced with Localhost**
All instances of `https://mut-environmental-health-wil-backend.onrender.com` have been replaced with `http://localhost:8080` across the entire Angular frontend.

### 2. **Files Updated**
- **Services** (3 files):
  - `src/app/services/auth.service.ts`
  - `src/app/services/logbook/logbook.service.ts`
  - `src/app/services/analytics.service.ts`

- **Environment Configuration** (1 file):
  - `src/environments/environment.ts`

- **Student Components** (5 files):
  - `src/app/components/student/student-applications/student-applications.component.ts`
  - `src/app/components/student/student-application-edit/student-application-edit.component.ts`
  - `src/app/components/student/reflections/reflections.component.ts`
  - `src/app/components/student/logbook/logbook.component.ts`
  - `src/app/components/student/letter/letter.component.ts`

- **Mentor Components** (3 files):
  - `src/app/components/mentor/mentor-logbooks/mentor-logbooks.component.ts`
  - `src/app/components/mentor/mentor-logsheets/mentor-logsheets.component.ts`
  - `src/app/components/mentor/mentor-declaration-letters/mentor-declaration-letters.component.ts`

- **HPCSA Components** (4 files):
  - `src/app/components/HPCSA/student-logbook-viewer/student-logbook-viewer.component.ts`
  - `src/app/components/HPCSA/hpcsa-logbooks/hpcsa-logbooks.component.ts`
  - `src/app/components/HPCSA/hpcsa-logsheets/hpcsa-logsheets.component.ts`
  - `src/app/components/HPCSA/hpcsa-declaration/hpcsa-declaration.component.ts`
  - `src/app/components/HPCSA/hpcsa-applications/hpcsa-applications.component.ts`
  - `src/app/components/HPCSA/hpcsa-signup/hpcsa-signup.component.ts`

- **Admin Components** (8 files):
  - `src/app/components/admin/logbook-file/logbook-file.component.ts`
  - `src/app/components/admin/view-logbooks/view-logbooks.component.ts`
  - `src/app/components/admin/view-users/view-users.component.ts`
  - `src/app/components/admin/view-declaration-letters/view-declaration-letters.component.ts`
  - `src/app/components/admin/user-management/user-management.component.ts`
  - `src/app/components/admin/staff-management/staff-management.component.ts`
  - `src/app/components/admin/placement/placement.component.ts`
  - `src/app/components/admin/applications/applications.component.ts`
  - `src/app/components/admin/sign-logsheets/sign-logsheets.component.ts`
  - `src/app/components/admin/viewlogsheets/viewlogsheets.component.ts`

- **Shared Components** (1 file):
  - `src/app/components/shared/logbook-dialog/logbook-dialog.component.ts`

### 3. **Total Files Modified**: ~30+ TypeScript files

---

## 📋 Next Steps for Complete Migration

### Phase 1: Set Up MongoDB
1. **Install MongoDB** (choose one):
   - **MongoDB Atlas** (Cloud - Recommended):
     - Sign up at https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Create a database user
     - Whitelist your IP address
     - Get connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/environmental_health_wil`
   
   - **Local MongoDB**:
     ```powershell
     # Install MongoDB Community Edition
     choco install mongodb
     # Or download from https://www.mongodb.com/try/download/community
     ```

2. **Test Connection**:
   ```powershell
   # For Atlas
   mongosh "mongodb+srv://<username>:<password>@cluster.mongodb.net/environmental_health_wil"
   
   # For Local
   mongosh
   ```

### Phase 2: Create Node.js/Express Backend
1. **Create Backend Directory**:
   ```powershell
   cd c:\xampp\htdocs\environmental-health-wil-frontend
   mkdir api
   cd api
   npm init -y
   ```

2. **Install Dependencies**:
   ```powershell
   npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken
   npm install --save-dev typescript @types/express @types/node @types/cors ts-node nodemon
   ```

3. **Create `.env` file**:
   ```env
   PORT=8080
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/environmental_health_wil
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Create `tsconfig.json`**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "lib": ["ES2020"],
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

5. **Update `package.json` scripts**:
   ```json
   "scripts": {
     "dev": "nodemon src/server.ts",
     "build": "tsc",
     "start": "node dist/server.js"
   }
   ```

### Phase 3: Design MongoDB Schema
Based on your `environmental_health_wil_db.sql`, create Mongoose models:

**Key Collections**:
- `students` - Student profiles and application data
- `logsheets` - Daily logsheet entries (normalize activity1-14 to array)
- `guest_lectures` - Event/lecture information
- `attendance_registers` - Event attendance tracking
- `declaration_letters` - Declaration letter submissions
- `blocked_signups` - Blocked email addresses
- `audit_logs` - System audit trail
- `access_logs` - Document access tracking

### Phase 4: Implement API Endpoints
Create routes matching your current API calls:

**Auth Routes** (`/api/auth/*`):
- POST `/api/hpcsa/login`
- POST `/api/validate-signup-code`
- POST `/api/block-signup-email`
- POST `/api/validate-staff-code`
- POST `/api/validate-event-code`

**Student Routes** (`/api/students/*`):
- POST `/api/students/createStudent`
- GET `/api/student/:studentNumber`
- POST `/api/update-student-status`
- GET `/api/student_applications?email=...`
- PUT `/api/applications/update`
- GET `/api/application-by-email?email=...`

**Logbook Routes** (`/api/logsheets/*` or `/api/logbook/*`):
- GET `/api/check-logsheet/:studentNumber`
- GET `/api/get-logsheet/:studentNumber`
- GET `/api/logbook?student_number=...`
- GET `/api/daily-logsheets`
- PUT `/api/sign-logsheets/:id`
- PUT `/api/update-logsheets/:id`
- DELETE `/api/delete-logsheets/:id`
- POST `/api/update-mentor-check`
- PATCH `/api/logsheets/:id/verify`
- POST `/api/update-hpcsa-report/:studentNumber`
- GET `/api/hpcsa-status/:studentNumber`

**Event/Lecture Routes** (`/api/*`):
- POST `/api/guest-lectures`
- GET `/api/upcoming-events`
- POST `/api/lectures/register`
- GET `/api/attendance-registers`
- GET `/api/attendance-registers/:eventId`

**Declaration Letter Routes** (`/api/*`):
- GET `/api/letters/:studentNumber`
- GET `/api/declaration-letters`
- DELETE `/api/del-declaration-letters/:id`

**Reflection Routes** (`/api/*`):
- GET `/api/reflection/:studentNumber`
- POST `/api/submit-reflection`

**Admin Routes** (`/api/*`):
- GET `/api/students-with-log-sheets`
- POST `/api/suspend-student/:studentNumber`
- POST `/api/unenroll-student/:studentNumber`
- POST `/api/enroll-student/:studentNumber`
- DELETE `/api/staff/:id`
- GET `/api/analytics/*`

### Phase 5: Data Migration
1. **Export MySQL Data**:
   ```powershell
   # From your existing MySQL database
   mysqldump -u root -p environmental_health_wil_db > backup.sql
   ```

2. **Create Migration Script** (`api/scripts/migrate.ts`):
   - Connect to both MySQL and MongoDB
   - Transform and migrate data collection by collection
   - Handle data normalization (e.g., activity1-14 → activities array)

3. **Run Migration**:
   ```powershell
   cd api
   npm run migrate
   ```

### Phase 6: Testing
1. **Start Backend**:
   ```powershell
   cd api
   npm run dev
   ```

2. **Start Angular Frontend**:
   ```powershell
   cd c:\xampp\htdocs\environmental-health-wil-frontend
   ng serve
   ```

3. **Test Key Flows**:
   - User login/signup
   - Student application submission
   - Logsheet creation and viewing
   - Event registration
   - Admin dashboard

### Phase 7: Deployment
1. **Backend Deployment** (choose one):
   - Render.com
   - Railway.app
   - Fly.io
   - AWS/Azure/GCP

2. **Frontend Deployment**:
   - Update `src/environments/environment.prod.ts` with production API URL
   - Deploy to Netlify/Vercel or keep on current hosting

3. **Update Environment Variables**:
   - Set `MONGODB_URI` in production
   - Set `JWT_SECRET` securely
   - Configure CORS for production domain

---

## 🔧 Troubleshooting

### If Backend is Not Running
- Ensure MongoDB is running (Atlas or local)
- Check `.env` file has correct `MONGODB_URI`
- Verify port 8080 is not in use: `netstat -ano | findstr :8080`

### If Frontend Can't Connect
- Check browser console for CORS errors
- Ensure backend has CORS enabled for `http://localhost:4200`
- Verify API endpoints match between frontend and backend

### Common Issues
- **Port conflicts**: Change port in backend `.env` and Angular `environment.ts`
- **CORS errors**: Add `app.use(cors({ origin: 'http://localhost:4200' }))` in Express
- **MongoDB connection**: Check network access and credentials in Atlas

---

## 📚 Resources
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)
- [Angular HTTP Client](https://angular.io/guide/http)

---

## ✅ Current Status
- ✅ Frontend URLs updated to localhost:8080
- ⏳ Backend API needs to be created
- ⏳ MongoDB needs to be set up
- ⏳ Data migration needs to be performed
- ⏳ Testing and deployment pending

**Next Immediate Action**: Set up MongoDB (Atlas or local) and create the Node.js/Express backend API.
