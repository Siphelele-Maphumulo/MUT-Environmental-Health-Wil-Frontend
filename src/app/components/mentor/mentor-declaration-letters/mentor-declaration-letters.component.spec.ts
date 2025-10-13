import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorDeclarationLettersComponent } from './mentor-declaration-letters.component';

describe('MentorDeclarationLettersComponent', () => {
  let component: MentorDeclarationLettersComponent;
  let fixture: ComponentFixture<MentorDeclarationLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorDeclarationLettersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorDeclarationLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
