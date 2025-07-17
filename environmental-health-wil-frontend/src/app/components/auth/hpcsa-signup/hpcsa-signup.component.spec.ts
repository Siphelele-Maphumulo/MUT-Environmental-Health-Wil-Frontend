import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaSignupComponent } from './hpcsa-signup.component';

describe('HpcsaSignupComponent', () => {
  let component: HpcsaSignupComponent;
  let fixture: ComponentFixture<HpcsaSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
