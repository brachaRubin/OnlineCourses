import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  imports: [CommonModule],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.css'
})
export class LessonCardComponent {
 title = input<string>('');
  content = input<string>('');
}
