import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorsComponent } from './auditors.component';

describe('AuditorsComponent', () => {
  let component: AuditorsComponent;
  let fixture: ComponentFixture<AuditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
