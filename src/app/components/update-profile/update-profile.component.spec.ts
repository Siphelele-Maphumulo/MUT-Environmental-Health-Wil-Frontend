import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProfileComponent } from './update-profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Added for HttpClient
import { UserService } from './../../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';  // Added for Router
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Added for animations

describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateProfileComponent,
        HttpClientTestingModule,       // Mocked HttpClient for service
        ReactiveFormsModule,           // For reactive forms
        RouterTestingModule,           // Mocks routing behavior
        BrowserAnimationsModule        // Needed for Angular animations
      ],
      providers: [UserService]         // Provide the UserService
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
