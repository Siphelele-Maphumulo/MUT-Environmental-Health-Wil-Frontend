import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutusModalComponent } from './aboutus-modal.component';

describe('AboutusModalComponent', () => {
  let component: AboutusModalComponent;
  let fixture: ComponentFixture<AboutusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
