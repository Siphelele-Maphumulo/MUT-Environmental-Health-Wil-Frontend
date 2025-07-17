import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlogsheetsComponent } from './viewlogsheets.component';

describe('ViewlogsheetsComponent', () => {
  let component: ViewlogsheetsComponent;
  let fixture: ComponentFixture<ViewlogsheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewlogsheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewlogsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
