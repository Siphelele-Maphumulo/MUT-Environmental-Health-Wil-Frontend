import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaApplicationsComponent } from './hpcsa-applications.component';

describe('HpcsaApplicationsComponent', () => {
  let component: HpcsaApplicationsComponent;
  let fixture: ComponentFixture<HpcsaApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
