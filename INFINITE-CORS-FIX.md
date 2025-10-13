# Fix: Infinite CORS Errors & Signature Display Issues

## Problem
- Infinite CORS errors in console
- Signatures not displaying on student-applications page
- Browser console showing repeated requests to `http://localhost:8080/uploads/...`

## Root Causes

### 1. **Infinite Loop Issue**
The `getSafeUrl()` method was being called during data mapping in the subscribe block, which caused Angular's change detection to trigger repeatedly because `bypassSecurityTrustResourceUrl()` returns a new object reference each time.

### 2. **CORS Headers Missing**
Backend static file serving doesn't have proper CORS headers.

## Frontend Fix (Already Applied) ✅

### Changed in `student-applications.component.ts`:

**Before (Caused Infinite Loop):**
```typescript
.subscribe({
  next: (data) => {
    this.applications = data.map((app) => ({
      ...app,
      status: this.normalizeStatus(app.status),
      safeSignatureUrl: this.getSafeUrl(app.signature_image), // ❌ BAD
      safeIdDocUrl: this.getSafeUrl(app.id_document),         // ❌ BAD
      safeCvUrl: this.getSafeUrl(app.cv_document),            // ❌ BAD
    }));
  }
});
```

**After (Fixed):**
```typescript
.subscribe({
  next: (data) => {
    this.applications = data.map((app) => ({
      ...app,
      status: this.normalizeStatus(app.status) // ✅ Only normalize status
    }));
  }
});
```

### New Method Added:
```typescript
getImageUrl(filename: string): string {
  if (!filename) return '';
  
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  } else if (filename.startsWith('uploads/')) {
    return `http://localhost:8080/${filename}`;
  } else if (filename.startsWith('/')) {
    return `http://localhost:8080${filename}`;
  } else {
    return `http://localhost:8080/uploads/${filename}`;
  }
}
```

### HTML Template Updated:
```html
<img
  *ngIf="app.signature_image"
  [src]="getImageUrl(app.signature_image)"
  alt="Signature"
  height="30"
  (error)="onImageError($event)"
  crossorigin="anonymous"
/>
```

---

## Backend Fix (You Need to Apply This)

### Step 1: Update Static File Serving

In your **server.js** file, find this section (around line 135-142):

```javascript
// ======= Serve Uploaded Files ======= //
app.use("/uploads", (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOADS_PATH));
```

**Replace it with:**

```javascript
// ======= Serve Uploaded Files with Proper CORS ======= //
app.use("/uploads", (req, res, next) => {
  // CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:4200',
    'https://mut-environmental-health.netlify.app',
    'https://environmental-health-wil-frontend.netlify.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Resource policy
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Cache control
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
}, express.static(UPLOADS_PATH, {
  setHeaders: (res, filePath) => {
    // Set correct content type
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (filePath.endsWith('.doc')) {
      res.setHeader('Content-Type', 'application/msword');
    } else if (filePath.endsWith('.docx')) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  }
}));
```

### Step 2: Update Main CORS Configuration

Find your main CORS configuration (around line 40-60) and ensure it looks like this:

```javascript
const allowedOrigins = [
  "http://localhost:4200",
  "https://mut-environmental-health.netlify.app",
  "https://environmental-health-wil-frontend.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow in development, change to false in production
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));
```

### Step 3: Remove Conflicting Security Headers

Find this middleware (around line 100-108) and **comment it out or remove it**:

```javascript
// ❌ REMOVE OR COMMENT OUT THIS:
app.use((req, res, next) => {
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: http://localhost:8080"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});
```

**Replace with:**

```javascript
// ✅ More permissive for development
app.use((req, res, next) => {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});
```

---

## Testing Steps

### 1. Restart Backend
```powershell
# Stop your Node.js server (Ctrl+C)
# Then restart
node server.js
```

### 2. Clear Browser Cache
- Open DevTools (F12)
- Go to Network tab
- Right-click → "Clear browser cache"
- Or: Right-click refresh button → "Empty Cache and Hard Reload"

### 3. Test the Page
1. Navigate to `http://localhost:4200/student-applications`
2. Open DevTools Console (F12)
3. Check for:
   - ✅ No infinite loop errors
   - ✅ No CORS errors
   - ✅ Signatures displaying correctly

### 4. Check Network Tab
- Open Network tab in DevTools
- Filter by "uploads"
- You should see:
  - ✅ Status: 200 OK
  - ✅ Type: png/jpeg/etc.
  - ✅ No CORS errors

---

## Verification Checklist

- [ ] Backend server restarted
- [ ] Browser cache cleared
- [ ] No infinite console errors
- [ ] No CORS errors in console
- [ ] Signatures display correctly
- [ ] Network tab shows 200 OK for image requests
- [ ] Response headers include `Access-Control-Allow-Origin`

---

## If Still Not Working

### Check 1: Verify File Exists
```powershell
# Check if uploads directory exists
ls uploads/

# Check specific file
ls uploads/1234567890-signature.png
```

### Check 2: Check MongoDB Data
Open MongoDB and verify the signature_image field:
```javascript
// Should be one of these formats:
"signature_image": "uploads/signatures/file.png"
"signature_image": "uploads/file.png"
"signature_image": "http://localhost:8080/uploads/file.png"
```

### Check 3: Test Direct URL
Open in browser:
```
http://localhost:8080/uploads/your-file-name.png
```

If this doesn't work, your backend static serving is broken.

### Check 4: Console Logs
Check what URLs are being generated:
```typescript
// Add this temporarily in your component
console.log('Signature URL:', this.getImageUrl(app.signature_image));
```

---

## Summary

**Frontend Changes (Already Done):**
- ✅ Removed `getSafeUrl()` calls from data mapping
- ✅ Created `getImageUrl()` method for simple URL construction
- ✅ Updated HTML template to use `getImageUrl()`
- ✅ Added `crossorigin="anonymous"` attribute

**Backend Changes (You Need to Do):**
- ⏳ Update static file serving middleware with proper CORS
- ⏳ Fix main CORS configuration
- ⏳ Remove conflicting security headers
- ⏳ Restart server

After applying the backend changes, the infinite CORS errors should stop and signatures should display correctly! 🎉
