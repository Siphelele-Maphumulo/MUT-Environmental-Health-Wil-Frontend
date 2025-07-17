import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflectionsComponent } from './reflections.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ReflectionsComponent', () => {
  let component: ReflectionsComponent;
  let fixture: ComponentFixture<ReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReflectionsComponent,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule // Import BrowserAnimationsModule here
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ReflectionsComponent', () => {
    expect(component).toBeTruthy();
  });
});
