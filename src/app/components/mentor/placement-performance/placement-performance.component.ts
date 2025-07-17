import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-placement-performance',
    imports: [
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatToolbarModule,
        CommonModule,
    ],
    templateUrl: './placement-performance.component.html',
    styleUrls: ['./placement-performance.component.scss']
})
export class PlacementPerformanceComponent {
  students = [
    { value: 'student1', viewValue: 'Student 1' },
    { value: 'student2', viewValue: 'Student 2' },
    { value: 'student3', viewValue: 'Student 3' }
  ];

  ratings = [1, 2, 3, 4, 5];

  categories = [
    {
      id: 1,
      title: 'Category 1 - Responsibility for own learning',
      description: 'Motivation and Enthusiasm. Student showed eagerness to learn and optimize the placement experience.'
    },
    {
      id: 2,
      title: 'Category 2 - Competence in placement activities',
      description: 'Knowledge Base. Student\'s understanding of subject areas and role in their placement position.'
    },
    {
      id: 3,
      title: 'Category 3 - Critical Thinking Creativity',
      description: 'Creativity and Innovation. Student showed level of creativity and innovation as demonstrated.'
    }
  ];

  rate(categoryId: number, rating: number) {
    console.log(`Category ${categoryId} rated with ${rating} stars`);
  }

  submitAssessment() {
    console.log('Assessment Submitted');
  }
}
