import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogsheetComponent } from './update-logsheet.component';

describe('UpdateLogsheetComponent', () => {
  let component: UpdateLogsheetComponent;
  let fixture: ComponentFixture<UpdateLogsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateLogsheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLogsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
