import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLogbooksComponent } from './view-logbooks.component';

describe('ViewLogbooksComponent', () => {
  let component: ViewLogbooksComponent;
  let fixture: ComponentFixture<ViewLogbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLogbooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLogbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
