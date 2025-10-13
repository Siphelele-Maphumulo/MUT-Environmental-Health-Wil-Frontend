import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentorProfileComponent } from './mentor-profile.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

describe('MentorProfileComponent', () => {
  let component: MentorProfileComponent;
  let fixture: ComponentFixture<MentorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MentorProfileComponent,
        NoopAnimationsModule, // For testing environment
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        CommonModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MentorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the MentorProfileComponent', () => {
    expect(component).toBeTruthy();
  });
});
