import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLogsheetsComponent } from './sign-logsheets.component';

describe('SignLogsheetsComponent', () => {
  let component: SignLogsheetsComponent;
  let fixture: ComponentFixture<SignLogsheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLogsheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLogsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
