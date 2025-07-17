import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReflectionsComponent } from './view-reflections.component';

describe('ViewReflectionsComponent', () => {
  let component: ViewReflectionsComponent;
  let fixture: ComponentFixture<ViewReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReflectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReflectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
