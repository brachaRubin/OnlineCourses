import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface CourseData {
  title: string;
  description: string;
}
@Component({
  selector: 'app-course-form-dialog',
  imports: [  CommonModule,MatFormFieldModule,MatInputModule,FormsModule,MatDialogModule],
  templateUrl: './course-form-dialog.component.html',
  styleUrl: './course-form-dialog.component.css'
})
export class CourseFormDialogComponent {
  course = signal<CourseData>({
   
    title: '',
    description: '',
  });

  constructor(
    public dialogRef: MatDialogRef<CourseFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseData; isEdit: boolean }
  ) {
    // אתחול המשתנה לאחר ש-`this.data` הוקצה
    this.course.set({ ...this.data.course });
  }

  // פונקציה לסיום הפעולה
  onSave(): void {
    this.dialogRef.close(this.course());
  }

  // פונקציה לביטול הפעולה
  onCancel(): void {
    this.dialogRef.close();
  }
}
