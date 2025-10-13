import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LogsheetComponent } from './logsheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../services/auth.service';

describe('LogsheetComponent', () => {
  let component: LogsheetComponent;
  let fixture: ComponentFixture<LogsheetComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [LogsheetComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthService, useValue: {} },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should limit selected activities to 6 and show a snackbar message', () => {
    for (let i = 0; i < 7; i++) {
      component.limitSelection({
        source: { checked: true },
        checked: true,
      } as any);
    }
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'You can only select up to 6 activities.',
      'Close',
      {
        duration: 3000,
      }
    );
  });
});
