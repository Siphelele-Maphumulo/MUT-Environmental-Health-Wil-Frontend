import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

interface Class {
  className: string;
  level: string;
  date: string;
  type: string;
  instructor: string;
}

@Component({
    selector: 'app-class-page',
    imports: [
        CommonModule,
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
    ],
    templateUrl: './class-page.component.html',
    styleUrls: ['./class-page.component.scss']
})
export class ClassPageComponent implements AfterViewInit {
  displayedColumns: string[] = ['class', 'level', 'date', 'type', 'instructor', 'actions'];
  classes: Class[] = [];
  dataSource = new MatTableDataSource<Class>(this.classes);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.generateClasses();
  }

  generateClasses(): void {
    const instructors = ['Siphelele Maphumulo', 'Nkosiphendule Jwara'];
    const types = ['Self-paced', 'Instructor-led'];

    for (let year = 2024; year >= 2020; year--) {
      for (let level = 1; level <= 4; level++) {
        this.classes.push({
          className: `Class ${year}`,
          level: `Level ${level}`,
          date: `Jan 01, ${year} - Dec 31, ${year}`,
          type: types[level % types.length],
          instructor: instructors[level % instructors.length],
        });
      }
    }
    this.dataSource.data = this.classes;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  applyTypeFilter(type: string): void {
    this.dataSource.data = type ? this.classes.filter((cls) => cls.type === type) : this.classes;
  }

  suspendClass(classInfo: Class) {
    console.log(`Suspending class: ${classInfo.className} - ${classInfo.level}`);
  }

  deleteClass(classInfo: Class) {
    console.log(`Deleting class: ${classInfo.className} - ${classInfo.level}`);
  }
}
