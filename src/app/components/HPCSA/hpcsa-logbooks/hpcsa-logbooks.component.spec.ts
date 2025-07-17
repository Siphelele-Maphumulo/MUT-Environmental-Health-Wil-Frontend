import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaLogbooksComponent } from './hpcsa-logbooks.component';

describe('HpcsaLogbooksComponent', () => {
  let component: HpcsaLogbooksComponent;
  let fixture: ComponentFixture<HpcsaLogbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaLogbooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaLogbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
