import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-mentor-guide',
    imports: [
        MatButtonModule,
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
    ],
    templateUrl: './mentor-guide.component.html',
    styleUrl: './mentor-guide.component.scss'
})
export class MentorGuideComponent {

}
