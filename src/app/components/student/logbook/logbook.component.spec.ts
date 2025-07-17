import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogbookComponent } from './logbook.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { DataService } from '../../../services/data.service';

describe('LogbookComponent', () => {
  let component: LogbookComponent;
  let fixture: ComponentFixture<LogbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookComponent, HttpClientTestingModule], // Include HttpClientTestingModule
      providers: [DataService], // Provide DataService
    }).compileComponents();

    fixture = TestBed.createComponent(LogbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
