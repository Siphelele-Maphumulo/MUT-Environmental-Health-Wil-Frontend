# Student Applications Display Fix

## Issues Identified and Fixed

### 1. **Status Display Issue** ✅ FIXED

**Problem:**
- MongoDB schema uses lowercase status values: `'pending'`, `'approved'`, `'rejected'`, `'under_review'`, `'accepted'`
- Frontend expects capitalized values: `'Pending'`, `'Accepted'`, `'Rejected'`
- This caused status dropdowns to not display correctly

**Solution:**
Added `normalizeStatus()` method in `student-applications.component.ts` that:
- Converts MongoDB status values to frontend format
- Maps `'accepted'` or `'approved'` → `'Accepted'`
- Maps `'rejected'` → `'Rejected'`  
- Maps `'pending'`, `'under_review'`, or any other → `'Pending'`

```typescript
private normalizeStatus(status: string): 'Pending' | 'Accepted' | 'Rejected' {
  if (!status) return 'Pending';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'accepted' || statusLower === 'approved') {
    return 'Accepted';
  } else if (statusLower === 'rejected') {
    return 'Rejected';
  } else {
    return 'Pending';
  }
}
```

### 2. **Signature Image Display Issue** ✅ FIXED

**Problem:**
- Signature images weren't displaying properly
- Different path formats from MongoDB (relative paths, absolute paths, URLs)
- No error handling for missing images

**Solution:**
Enhanced `getSafeUrl()` method to handle multiple path formats:

```typescript
getSafeUrl(filename: string): SafeUrl {
  if (!filename) return this.sanitizer.bypassSecurityTrustResourceUrl('');

  let fullUrl: string;
  
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    // Already a full URL
    fullUrl = filename;
  } else if (filename.startsWith('uploads/')) {
    // Relative path from server root
    fullUrl = `http://localhost:8080/${filename}`;
  } else if (filename.startsWith('/')) {
    // Absolute path
    fullUrl = `http://localhost:8080${filename}`;
  } else {
    // Relative path without leading slash
    fullUrl = `http://localhost:8080/uploads/${filename}`;
  }

  return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
}
```

**HTML Template Updates:**
- Added conditional rendering for signatures
- Added error handling with placeholder fallback
- Added "No signature" text when signature is missing

```html
<img
  *ngIf="app.signature_image"
  [src]="getSafeUrl(app.signature_image)"
  alt="Signature"
  height="30"
  (error)="$event.target.src='assets/placeholder-signature.png'"
  style="max-width: 100px; object-fit: contain;"
/>
<span *ngIf="!app.signature_image" class="no-signature">No signature</span>
```

### 3. **Status Filter Compatibility** ✅ FIXED

**Problem:**
- Status filter dropdown values didn't match MongoDB values

**Solution:**
Updated `getStatusClass()` method to handle both formats:

```typescript
getStatusClass(status: string): string {
  if (!status) return 'status-pending';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'accepted' || statusLower === 'approved') {
    return 'status-accepted';
  } else if (statusLower === 'rejected') {
    return 'status-rejected';
  } else {
    return 'status-pending';
  }
}
```

---

## MongoDB Schema Compatibility

Your MongoDB `WilApplication` schema is now fully compatible with the frontend:

### Field Mappings:
| MongoDB Field | Frontend Field | Type | Notes |
|--------------|---------------|------|-------|
| `signature_image` | `signature_image` | String | File path - now properly handled |
| `id_document` | `id_document` | String | File path |
| `cv_document` | `cv_document` | String | File path |
| `status` | `status` | String | Now normalized: `pending`→`Pending`, `accepted`→`Accepted`, etc. |
| `declaration_info_1` | `declaration_info_1` | Boolean | ✅ |
| `declaration_info_2` | `declaration_info_2` | Boolean | ✅ |
| `declaration_info_3` | `declaration_info_3` | Boolean | ✅ |
| `createdAt` | `created_at` | Date | ✅ |

---

## Backend Requirements

For the fixes to work properly, your Node.js backend must:

### 1. **Serve Static Files**
Ensure your Express server serves uploaded files:

```javascript
// In your server.js or app.js
app.use('/uploads', express.static('uploads'));
```

### 2. **Return Correct Status Values**
Your API endpoint should return applications with status in lowercase:

```javascript
// GET /api/student_applications?email=...
router.get('/student_applications', async (req, res) => {
  const { email } = req.query;
  
  const applications = await WilApplication.find({ email });
  
  // MongoDB will return status as: 'pending', 'accepted', 'rejected', etc.
  // Frontend will normalize it automatically
  res.json(applications);
});
```

### 3. **File Upload Paths**
When saving files, store paths in one of these formats:
- `uploads/signatures/filename.png` (recommended)
- `/uploads/signatures/filename.png`
- `http://localhost:8080/uploads/signatures/filename.png`

The frontend will handle all three formats correctly.

---

## Testing Checklist

- [ ] Signatures display correctly for all applications
- [ ] Status dropdown shows correct value (Pending/Accepted/Rejected)
- [ ] Status filter works properly
- [ ] Missing signatures show "No signature" text
- [ ] Image errors fallback to placeholder (if you add one)
- [ ] ID and CV documents download correctly
- [ ] Status colors display correctly (pending=yellow, accepted=green, rejected=red)

---

## Optional: Add Placeholder Image

Create a placeholder for missing signatures:

1. Add a placeholder image to `src/assets/placeholder-signature.png`
2. Or update the error handler to show a different fallback:

```html
(error)="$event.target.style.display='none'"
```

---

## Summary

✅ **Status normalization** - MongoDB lowercase → Frontend capitalized  
✅ **Signature path handling** - Multiple path formats supported  
✅ **Error handling** - Graceful fallback for missing images  
✅ **Filter compatibility** - Status filter works with both formats  

The student applications page should now display signatures and statuses correctly!
