import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="pdf-container">
      <div class="dialog-header">
        <h2>Document Viewer - {{ fileName }}</h2>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="downloadFile()">
            Download
          </button>
          <button mat-icon-button (click)="dialogRef.close()" class="close-button">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      
      <div class="content-area">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading document...</p>
        </div>
        
        <div *ngIf="error" class="error-message">
          <h3>Unable to load document</h3>
          <p>{{ error }}</p>
          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="openInNewTab()">
              Open in New Tab
            </button>
            <button mat-button (click)="dialogRef.close()">
              Close
            </button>
          </div>
        </div>
        
        <!-- PDF Display -->
        <div *ngIf="!isLoading && !error && isPdf" class="pdf-frame-container">
          <iframe 
            [src]="safeUrl" 
            width="100%" 
            height="100%"
            frameborder="0"
            (load)="onIframeLoad()"
            (error)="onIframeError()">
          </iframe>
          <div *ngIf="iframeError" class="iframe-fallback">
            <p>Unable to display PDF inline.</p>
            <button mat-raised-button color="primary" (click)="openInNewTab()">
              Open in New Tab
            </button>
          </div>
        </div>

        <!-- Image Display -->
        <div *ngIf="!isLoading && !error && !isPdf" class="image-container">
          <img 
            [src]="safeUrl" 
            [alt]="fileName" 
            class="document-image"
            (load)="onImageLoad()"
            (error)="onImageError()" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pdf-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      background: #f5f5f5;
      flex-shrink: 0;
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .close-button {
      color: #666;
    }
    
    .content-area {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    
    .loading, .error-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 100%;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196F3;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      color: #721c24;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      padding: 30px;
      max-width: 400px;
    }
    
    .error-message h3 {
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .action-buttons {
      margin-top: 20px;
      gap: 12px;
      display: flex;
      justify-content: center;
    }
    
    .pdf-frame-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .pdf-frame-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .iframe-fallback {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .image-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f8f8f8;
    }
    
    .document-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class PdfViewerComponent implements OnInit {
  isLoading = true;
  error: string | null = null;
  safeUrl: SafeResourceUrl | null = null;
  fileUrl: string = '';
  fileName: string = '';
  isPdf: boolean = false;
  iframeError: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      pdfUrl: string;
      studentNumber?: string;
      fileName?: string;
    },
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PdfViewerComponent>
  ) {
    console.log('PDF Viewer initialized with data:', data);
  }

  ngOnInit() {
    this.loadDocument();
  }

  private loadDocument(): void {
    try {
      // Get the raw URL
      const rawUrl = this.data.pdfUrl;
      console.log('Raw URL received:', rawUrl);

      // Extract filename
      this.fileName = this.data.fileName || this.extractFileName(rawUrl);
      
      // Determine file type
      this.isPdf = this.isPdfFile(this.fileName);
      console.log('File type detection - PDF:', this.isPdf, 'Filename:', this.fileName);

      // Construct the final URL
      this.fileUrl = this.constructFinalUrl(rawUrl);
      console.log('Final document URL:', this.fileUrl);

      // Create safe URL for display
      this.createSafeUrl();

    } catch (error) {
      console.error('Error loading document:', error);
      this.error = 'Failed to load document';
      this.isLoading = false;
    }
  }

  private extractFileName(url: string): string {
    // Remove query parameters and extract filename
    const cleanUrl = url.split('?')[0];
    return cleanUrl.split('/').pop() || 'document';
  }

  private isPdfFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
  }

  private constructFinalUrl(rawUrl: string): string {
    // If it's already a full URL, return as is
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    const baseUrl = 'http://localhost:8080';
    
    // Handle different URL patterns
    if (rawUrl.startsWith('/uploads/')) {
      return `${baseUrl}${rawUrl}`;
    } else if (rawUrl.includes('/') && !rawUrl.startsWith('/')) {
      return `${baseUrl}/${rawUrl}`;
    } else if (this.data.studentNumber) {
      return `${baseUrl}/uploads/${this.data.studentNumber}/${rawUrl}`;
    } else {
      return `${baseUrl}/uploads/${rawUrl}`;
    }
  }

  private createSafeUrl(): void {
    try {
      console.log('Creating safe URL for:', this.fileUrl);

      // For local development, we need to bypass security for localhost URLs
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
      
      console.log('Safe URL created successfully');
      this.isLoading = false;

    } catch (error) {
      console.error('Error creating safe URL:', error);
      this.error = 'Unable to display document securely';
      this.isLoading = false;
    }
  }

  onIframeLoad(): void {
    console.log('Iframe loaded successfully');
    this.isLoading = false;
    this.iframeError = false;
  }

  onIframeError(): void {
    console.error('Iframe failed to load');
    this.iframeError = true;
    this.isLoading = false;
    this.error = 'Failed to load document in viewer';
  }

  onImageLoad(): void {
    console.log('Image loaded successfully');
    this.isLoading = false;
  }

  onImageError(): void {
    console.error('Image failed to load');
    this.isLoading = false;
    this.error = 'Failed to load image';
  }

  downloadFile(): void {
    if (!this.fileUrl) return;

    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = this.fileUrl;
    a.download = this.fileName;
    a.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  openInNewTab(): void {
    if (!this.fileUrl) return;
    
    window.open(this.fileUrl, '_blank');
  }
}