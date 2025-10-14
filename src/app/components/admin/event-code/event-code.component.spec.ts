import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventCodeComponent } from './event-code.component';

describe('CreateEventCodeComponent', () => {
  let component: CreateEventCodeComponent;
  let fixture: ComponentFixture<CreateEventCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
