import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookFileComponent } from './logbook-file.component';

describe('LogbookFileComponent', () => {
  let component: LogbookFileComponent;
  let fixture: ComponentFixture<LogbookFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
