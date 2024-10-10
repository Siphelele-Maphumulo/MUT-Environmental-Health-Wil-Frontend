import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsheetComponent } from './logsheet.component';

describe('LogsheetComponent', () => {
  let component: LogsheetComponent;
  let fixture: ComponentFixture<LogsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
