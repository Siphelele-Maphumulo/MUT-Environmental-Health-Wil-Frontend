import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookComponent } from './logbook.component';

describe('LogbookComponent', () => {
  let component: LogbookComponent;
  let fixture: ComponentFixture<LogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
