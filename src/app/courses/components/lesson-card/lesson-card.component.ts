import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  imports: [CommonModule],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.css'
})
export class LessonCardComponent {
  title = input<string>('');
  content = input<string>('');
  id = input<number>(0);


  lessonSelected = output<number>();

  onLessonSelected() {
    this.lessonSelected.emit(this.id());
  }
}
