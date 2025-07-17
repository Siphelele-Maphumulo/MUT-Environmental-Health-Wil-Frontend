import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogformComponent } from './logform.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LogformComponent', () => {
  let component: LogformComponent;
  let fixture: ComponentFixture<LogformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LogformComponent,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the LogformComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should simulate button clicks', () => {
    spyOn(component, 'onVerifyClick');
    spyOn(component, 'onDoneClick');

    // Simulate Verify button click
    const verifyButton = fixture.debugElement.query(By.css('.button-group button:first-child'));
    verifyButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.onVerifyClick).toHaveBeenCalled();

    // Simulate Done button click
    const doneButton = fixture.debugElement.query(By.css('.button-group button:last-child'));
    doneButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.onDoneClick).toHaveBeenCalled();
  });
});
