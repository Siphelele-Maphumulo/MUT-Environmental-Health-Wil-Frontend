import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationLetterComponent } from './declaration-letter.component';

describe('DeclarationLetterComponent', () => {
  let component: DeclarationLetterComponent;
  let fixture: ComponentFixture<DeclarationLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarationLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
