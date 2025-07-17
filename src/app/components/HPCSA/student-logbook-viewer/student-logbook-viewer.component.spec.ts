import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentLogbookViewerComponent } from './student-logbook-viewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Import for animations

describe('StudentLogbookViewerComponent', () => {
  let component: StudentLogbookViewerComponent;
  let fixture: ComponentFixture<StudentLogbookViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentLogbookViewerComponent,
        BrowserAnimationsModule  // Added for Angular Material animations
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentLogbookViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the StudentLogbookViewerComponent', () => {
    expect(component).toBeTruthy();
  });
});
