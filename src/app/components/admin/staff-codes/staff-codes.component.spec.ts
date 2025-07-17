import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCodesComponent } from './staff-codes.component';

describe('StaffCodesComponent', () => {
  let component: StaffCodesComponent;
  let fixture: ComponentFixture<StaffCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
