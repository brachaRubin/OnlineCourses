import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface LessonData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-lesson-form-dialog',
  imports: [MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './lesson-form-dialog.component.html',
  styleUrl: './lesson-form-dialog.component.css'
})
export class LessonFormDialogComponent {
  lesson = signal<LessonData>({
    title: '', 
    content: '',
  });

  constructor(
    public dialogRef: MatDialogRef<LessonFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {}

  // פונקציה לסיום הפעולה
  onSave(): void {
    this.dialogRef.close(this.lesson());
  }

  // פונקציה לביטול הפעולה
  onCancel(): void {
    this.dialogRef.close();
  }
}
