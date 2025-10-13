# File Upload System - Frontend Integration Guide

## ✅ What Was Done on Backend

Your backend now has a **new organized folder structure**:

```
backend/uploads/
├── signatures/     ← All signature files
├── documents/      ← All documents (ID, CV, PDFs)
└── events/         ← Event files
```

Files are automatically categorized based on field names:
- `signatureImage`, `student_signature`, `supervisor_signature` → `uploads/signatures/`
- `idDocument`, `cvDocument`, `document` → `uploads/documents/`
- Event files → `uploads/events/`

---

## ✅ What I Created for Frontend

### 1. FileUrlService (Universal Helper)

Created: `src/app/services/file-url.service.ts`

This service handles ALL file URL operations across your entire app:

```typescript
// Usage in any component:
constructor(private fileUrlService: FileUrlService) {}

// Get file URL
const url = this.fileUrlService.getFileUrl(app.signature_image);

// Download file
this.fileUrlService.downloadFile(app.cv_document, 'CV_Document');

// Open in new tab
this.fileUrlService.openFile(app.id_document);

// Check file type
if (this.fileUrlService.isImage(path)) { ... }
if (this.fileUrlService.isPdf(path)) { ... }
```

### 2. Updated Components

#### ✅ student-applications.component.ts
- Integrated FileUrlService
- Simplified download/open methods
- Removed redundant helper methods

---

## 🔧 How to Fix Remaining Components

### Pattern to Follow

For **ANY** component that displays or downloads files:

#### Step 1: Import the Service

```typescript
import { FileUrlService } from '../../../services/file-url.service';
```

#### Step 2: Inject in Constructor

```typescript
constructor(
  // ... other services
  private fileUrlService: FileUrlService
) {}
```

#### Step 3: Use for File URLs

```typescript
// In your template or component:

// For images (signatures, etc.)
getSignatureUrl(path: string): string {
  return this.fileUrlService.getFileUrl(path);
}

// For downloads
downloadDocument(path: string, name: string): void {
  this.fileUrlService.downloadFile(path, name);
}

// For opening in new tab
openDocument(path: string): void {
  this.fileUrlService.openFile(path);
}
```

---

## 📝 Components That Need Fixing

### 1. **logbook.component.ts** ✅ PARTIALLY DONE

**Current Issues:**
- Missing `Router` injection
- Missing `ngOnInit()` method
- Missing `dateStampControl` property

**Quick Fix:**

```typescript
// Add to imports
import { Router } from '@angular/router';

// Add to class properties
dateStampControl = new FormControl<Date | null>(null);

// Add to constructor
constructor(
  private http: HttpClient,
  private snackBar: MatSnackBar,
  private location: Location,
  private authService: AuthService,
  public dialog: MatDialog,
  private sanitizer: DomSanitizer,
  private fileUrlService: FileUrlService,
  private router: Router,  // ← ADD THIS
  @Inject(PLATFORM_ID) private platformId: Object
) { }

// Add ngOnInit method
ngOnInit(): void {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/login']);
  } else {
    this.userEmail = this.authService.getUserEmail();
    this.studentNumber = this.extractStudentNumber(this.userEmail);
    
    if (this.studentNumber) {
      this.fetchLogSheets(this.studentNumber);
    }
  }
  
  this.setupFilterListeners();
}
```

**Move initialization code from constructor to ngOnInit!**

---

### 2. **student-application-edit.component.ts**

**Add FileUrlService:**

```typescript
import { FileUrlService } from '../../../services/file-url.service';

constructor(
  private fb: FormBuilder,
  private http: HttpClient,
  private router: Router,
  private snackBar: MatSnackBar,
  private fileUrlService: FileUrlService  // ← ADD THIS
) { }

// Update preview methods
updateSignaturePreview(file: File): void {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.signaturePreview = e.target.result;
  };
  reader.readAsDataURL(file);
}

// For displaying existing files
getFileUrl(path: string): string {
  return this.fileUrlService.getFileUrl(path);
}

// For downloading
downloadFile(path: string, name: string): void {
  this.fileUrlService.downloadFile(path, name);
}
```

---

### 3. **guest-events.component.ts**

Find this component and add:

```typescript
import { FileUrlService } from '../../../services/file-url.service';

constructor(
  // ... existing services
  private fileUrlService: FileUrlService
) { }

// For event documents
getEventDocumentUrl(path: string): string {
  return this.fileUrlService.getFileUrl(path);
}

downloadEventDocument(event: any): void {
  if (event.document_path) {
    this.fileUrlService.downloadFile(event.document_path, `Event_${event.title}`);
  }
}

openEventDocument(event: any): void {
  if (event.document_path) {
    this.fileUrlService.openFile(event.document_path);
  }
}
```

---

### 4. **logbook-file.component.ts** (Admin)

```typescript
import { FileUrlService } from '../../../services/file-url.service';

constructor(
  // ... existing
  private fileUrlService: FileUrlService
) { }

getSignatureUrl(signature: string | null): string {
  return this.fileUrlService.getFileUrl(signature);
}
```

---

## 🎯 Universal Template Patterns

### For Displaying Images (Signatures)

```html
<!-- In any template -->
<img 
  *ngIf="item.signature_image"
  [src]="fileUrlService.getFileUrl(item.signature_image)"
  alt="Signature"
  height="30"
  (error)="onImageError($event)"
  crossorigin="anonymous"
/>
```

### For Download Buttons

```html
<button 
  mat-icon-button
  (click)="fileUrlService.downloadFile(item.cv_document, 'CV')"
  title="Download CV">
  <mat-icon>download</mat-icon>
</button>
```

### For Opening in New Tab

```html
<button 
  mat-icon-button
  (click)="fileUrlService.openFile(item.id_document)"
  title="View ID">
  <mat-icon>open_in_new</mat-icon>
</button>
```

---

## 🔍 Testing Checklist

After updating each component:

### 1. Student Applications Page
- [ ] Signatures display correctly
- [ ] ID documents download
- [ ] CV documents download
- [ ] No 404 errors in console
- [ ] No CORS errors

### 2. Logbook Page
- [ ] Student signatures display
- [ ] Supervisor signatures display
- [ ] Can download signatures
- [ ] No console errors

### 3. Student Application Edit
- [ ] Can see existing signature preview
- [ ] Can see existing ID preview
- [ ] Can see existing CV preview
- [ ] Can upload new files
- [ ] Previews update correctly

### 4. Guest Events
- [ ] Event documents display
- [ ] Can download event PDFs
- [ ] Can open in new tab

---

## 🚨 Common Issues & Solutions

### Issue 1: 404 Not Found

**Problem:** Files still showing 404

**Solution:** Check MongoDB data - paths should be:
```javascript
// ✅ CORRECT
"signature_image": "uploads/signatures/signatureImage_123456_file.png"
"id_document": "uploads/documents/idDocument_123456_file.pdf"

// ❌ WRONG (old format)
"signature_image": "1748174503600-440743204-0.png"
```

If you have old data, you need to either:
1. Copy old files to new structure
2. Update MongoDB paths
3. Ask users to re-upload

### Issue 2: CORS Errors

**Solution:** Already fixed! Your backend has proper CORS headers.

### Issue 3: Images Not Displaying

**Check:**
1. Is FileUrlService injected?
2. Is `getFileUrl()` being called?
3. Check browser Network tab - what URL is being requested?
4. Does file exist at that path on backend?

---

## 📦 Quick Migration Script (If Needed)

If you have old files in `uploads/` root that need organizing:

```powershell
# Run this in your backend directory

# Create folders if they don't exist
mkdir uploads\signatures -Force
mkdir uploads\documents -Force
mkdir uploads\events -Force

# Move signature files
Move-Item uploads\*signature*.png uploads\signatures\ -Force
Move-Item uploads\*signature*.jpg uploads\signatures\ -Force

# Move document files
Move-Item uploads\*.pdf uploads\documents\ -Force
Move-Item uploads\*.doc* uploads\documents\ -Force
Move-Item uploads\*ID*.* uploads\documents\ -Force
Move-Item uploads\*CV*.* uploads\documents\ -Force
```

---

## ✅ Summary

**What's Working:**
- ✅ FileUrlService created
- ✅ student-applications.component.ts updated
- ✅ Backend has new folder structure
- ✅ CORS is working

**What You Need to Do:**
1. Fix logbook.component.ts (move constructor code to ngOnInit)
2. Add FileUrlService to student-application-edit.component.ts
3. Add FileUrlService to guest-events.component.ts
4. Add FileUrlService to logbook-file.component.ts
5. Test all pages

**Pattern:** Import → Inject → Use `fileUrlService.getFileUrl()` everywhere!

---

## 🎓 Best Practice Going Forward

**Always use FileUrlService for file operations!**

```typescript
// ❌ DON'T DO THIS
const url = `http://localhost:8080/uploads/${filename}`;

// ✅ DO THIS
const url = this.fileUrlService.getFileUrl(filename);
```

This ensures:
- Consistent URL handling
- Easy to change base URL later
- Handles all path formats
- Works with new folder structure
- Centralized logic

---

Need help with a specific component? Let me know which one and I'll provide the exact code!
