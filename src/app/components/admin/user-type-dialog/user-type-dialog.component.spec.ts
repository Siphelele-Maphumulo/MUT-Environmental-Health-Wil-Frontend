import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeDialogComponent } from './user-type-dialog.component';

describe('UserTypeDialogComponent', () => {
  let component: UserTypeDialogComponent;
  let fixture: ComponentFixture<UserTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
