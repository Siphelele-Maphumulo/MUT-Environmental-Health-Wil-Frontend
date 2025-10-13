import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaLoginComponent } from './hpcsa-login.component';

describe('HpcsaLoginComponent', () => {
  let component: HpcsaLoginComponent;
  let fixture: ComponentFixture<HpcsaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
