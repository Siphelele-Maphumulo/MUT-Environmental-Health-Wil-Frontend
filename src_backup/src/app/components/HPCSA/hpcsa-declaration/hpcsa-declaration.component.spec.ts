import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaDeclarationComponent } from './hpcsa-declaration.component';

describe('HpcsaDeclarationComponent', () => {
  let component: HpcsaDeclarationComponent;
  let fixture: ComponentFixture<HpcsaDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
