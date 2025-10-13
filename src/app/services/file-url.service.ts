import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FileUrlService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Get the full URL for a file path
   * Handles the new folder structure: uploads/signatures/, uploads/documents/, uploads/events/
   */
  getFileUrl(filePath: string | null | undefined): string {
    if (!filePath) return '';

    // If already a full URL, return as-is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    // Remove leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

    // If path already includes 'uploads/', use it directly
    if (cleanPath.startsWith('uploads/')) {
      return `${this.baseUrl}/${cleanPath}`;
    }

    // Otherwise, assume it's in uploads root (legacy compatibility)
    return `${this.baseUrl}/uploads/${cleanPath}`;
  }

  /**
   * Get sanitized URL for Angular (use for iframe, object tags)
   */
  getSafeUrl(filePath: string | null | undefined): SafeResourceUrl {
    const url = this.getFileUrl(filePath);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Download a file
   */
  downloadFile(filePath: string, filename?: string): void {
    const url = this.getFileUrl(filePath);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || this.extractFilename(filePath);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Open file in new tab
   */
  openFile(filePath: string): void {
    const url = this.getFileUrl(filePath);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Extract filename from path
   */
  private extractFilename(path: string): string {
    if (!path) return 'download';
    const parts = path.split('/');
    return parts[parts.length - 1] || 'download';
  }

  /**
   * Check if file is an image
   */
  isImage(filePath: string): boolean {
    if (!filePath) return false;
    const ext = filePath.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext || '');
  }

  /**
   * Check if file is a PDF
   */
  isPdf(filePath: string): boolean {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
  }

  /**
   * Get file icon based on extension
   */
  getFileIcon(filePath: string): string {
    if (!filePath) return 'insert_drive_file';
    
    const ext = filePath.toLowerCase().split('.').pop();
    
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }
}
