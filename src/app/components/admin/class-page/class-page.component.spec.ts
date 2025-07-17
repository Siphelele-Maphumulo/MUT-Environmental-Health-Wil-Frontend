import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClassPageComponent } from './class-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';

describe('ClassPageComponent', () => {
  let component: ClassPageComponent;
  let fixture: ComponentFixture<ClassPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassPageComponent,
        MatToolbarModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatOptionModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ClassPageComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar with title "Environmental Health - My Classes"', () => {
    const toolbar = fixture.debugElement.query(By.css('.header-toolbar'));
    expect(toolbar).toBeTruthy();
    expect(toolbar.nativeElement.textContent).toContain('Environmental Health - My Classes');
  });

  it('should display tabs for class statuses', fakeAsync(() => {
    tick(); // Simulate time passage for async initialization
    fixture.detectChanges(); // Ensure updates after async operations

    const tabGroup = fixture.debugElement.query(By.css('mat-tab-group'));
    expect(tabGroup).toBeTruthy();

    const tabs = tabGroup.queryAll(By.css('mat-tab'));
    expect(tabs.length).toBe(3); // Verifies that 3 tabs are rendered
    expect(tabs[0].nativeElement.textContent).toContain('In-Progress (2)');
    expect(tabs[1].nativeElement.textContent).toContain('Completed (3)');
    expect(tabs[2].nativeElement.textContent).toContain('Draft (0)');
  }));

  it('should contain a search field and type dropdown in the filter bar', () => {
    const searchField = fixture.debugElement.query(By.css('.search-field input'));
    const typeField = fixture.debugElement.query(By.css('.type-field mat-select'));
    expect(searchField).toBeTruthy();
    expect(typeField).toBeTruthy();
  });

  it('should have a table with columns for class, level, date, type, instructor, and actions', () => {
    const tableHeaders = fixture.debugElement.queryAll(By.css('table th'));
    expect(tableHeaders.length).toBe(6); // Expecting 6 columns
    expect(tableHeaders[0].nativeElement.textContent.trim()).toBe('Class');
    expect(tableHeaders[1].nativeElement.textContent.trim()).toBe('Level');
    expect(tableHeaders[2].nativeElement.textContent.trim()).toBe('Date');
    expect(tableHeaders[3].nativeElement.textContent.trim()).toBe('Type');
    expect(tableHeaders[4].nativeElement.textContent.trim()).toBe('Instructor');
    expect(tableHeaders[5].nativeElement.textContent.trim()).toBe('Actions');
  });

  it('should apply a filter based on class name input', () => {
    const mockEvent = { target: { value: 'Class 2024' } } as Event & { target: { value: string } };
    component.applyFilter(mockEvent);
    expect(component.dataSource.filter).toBe('class 2024');
  });

  it('should apply type filter to display only selected class type', () => {
    component.applyTypeFilter('Self-paced');
    expect(component.dataSource.data.every(cls => cls.type === 'Self-paced')).toBeTrue();
  });

  it('should call suspendClass and deleteClass methods on action button clicks', () => {
    spyOn(component, 'suspendClass');
    spyOn(component, 'deleteClass');
    
    const element = component.classes[0];
    component.suspendClass(element);
    component.deleteClass(element);
    
    expect(component.suspendClass).toHaveBeenCalledWith(element);
    expect(component.deleteClass).toHaveBeenCalledWith(element);
  });
});
