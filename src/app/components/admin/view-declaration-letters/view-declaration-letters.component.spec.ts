import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeclarationLettersComponent } from './view-declaration-letters.component';

describe('ViewDeclarationLettersComponent', () => {
  let component: ViewDeclarationLettersComponent;
  let fixture: ComponentFixture<ViewDeclarationLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDeclarationLettersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeclarationLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
