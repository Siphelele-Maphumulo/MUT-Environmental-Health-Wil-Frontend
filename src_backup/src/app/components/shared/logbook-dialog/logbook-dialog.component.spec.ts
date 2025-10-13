import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookDialogComponent } from './logbook-dialog.component';

describe('LogbookDialogComponent', () => {
  let component: LogbookDialogComponent;
  let fixture: ComponentFixture<LogbookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
