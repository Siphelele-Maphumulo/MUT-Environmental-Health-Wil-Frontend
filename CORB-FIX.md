# CORB (Cross-Origin Read Blocking) Fix

## Problem
You're getting `Response was blocked by CORB` errors when trying to load images/files from `http://localhost:8080/uploads/...`

## Root Cause
The static file serving middleware needs proper CORS and resource policy headers.

## Solution

Replace your current static file serving middleware (around line 135-142 in your server.js):

### ❌ Current Code (Problematic):
```javascript
// ======= Serve Uploaded Files ======= //
app.use("/uploads", (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOADS_PATH));
```

### ✅ Fixed Code:
```javascript
// ======= Serve Uploaded Files with Proper CORS ======= //
app.use("/uploads", (req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Critical: Set proper resource policy
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Set proper content type headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
}, express.static(UPLOADS_PATH, {
  setHeaders: (res, path) => {
    // Set content type based on file extension
    if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (path.endsWith('.doc')) {
      res.setHeader('Content-Type', 'application/msword');
    } else if (path.endsWith('.docx')) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  }
}));
```

## Additional Fix: Update Security Headers

Also update your security headers middleware (around line 100-108):

### ❌ Current Code:
```javascript
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

### ✅ Fixed Code:
```javascript
app.use((req, res, next) => {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log("Body:", req.body);
    console.log("Files:", req.files);
  }
  
  // More permissive CSP for development
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: http://localhost:8080 http://localhost:4200; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
```

## Testing

After making these changes:

1. **Restart your backend server:**
   ```powershell
   # Stop the server (Ctrl+C)
   # Then restart
   node server.js
   ```

2. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button → "Empty Cache and Hard Reload"

3. **Test image loading:**
   - Navigate to student applications page
   - Check if signatures display correctly
   - Open Network tab in DevTools
   - Look for successful 200 responses for `/uploads/...` requests

## Expected Results

✅ Signatures should display correctly  
✅ No CORB errors in console  
✅ Network tab shows 200 OK for image requests  
✅ Proper Content-Type headers in response  

## If Still Not Working

### Check File Paths
Verify your uploaded files exist:
```powershell
# Check if uploads directory exists
ls uploads/

# Check if specific file exists
ls uploads/1234567890-signature.png
```

### Check File Permissions
```powershell
# Make sure Node.js can read the files
icacls uploads /grant Everyone:R /T
```

### Verify MongoDB Data
Check that your database has correct file paths:
```javascript
// In MongoDB, signature_image should be stored as:
"signature_image": "uploads/signatures/filename.png"
// OR
"signature_image": "uploads/filename.png"
```

## Alternative: Use Full URLs in Database

If you want to store full URLs in MongoDB instead of relative paths:

```javascript
// When saving to MongoDB
const signaturePath = `http://localhost:${port}/uploads/${filename}`;

// Then in frontend, use directly without modification
<img [src]="app.signature_image" />
```

## Summary

The main issue is that Express static file serving needs explicit CORS headers and proper content-type headers to avoid CORB blocking. The fix adds:

1. ✅ Proper CORS headers on static files
2. ✅ Cross-Origin-Resource-Policy header
3. ✅ Content-Type headers based on file extension
4. ✅ OPTIONS request handling for preflight
5. ✅ More permissive CSP for development

This should resolve all CORB errors! 🎉
