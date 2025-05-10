import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../services/course.service';
 

export interface LessonData {
  id?: number; // מזהה השיעור (לא חובה בהוספה)
  title: string;
  content: string;
}

@Component({
  selector: 'app-lesson-form-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './lesson-form-dialog.component.html',
  styleUrls: ['./lesson-form-dialog.component.css'],
})
export class LessonFormDialogComponent implements OnInit {
  lessons = signal<LessonData[]>([]); // רשימת השיעורים
  lesson = signal<LessonData>({
    title: '',
    content: '',
  });
  editedLesson = signal<LessonData>({ title: '', content: '' }); // אתחול ברירת מחדל
  isEditMode: 'edit' | 'add' | null = null; // מצב עריכה או הוספה
  currentPage = 1; // עמוד נוכחי
  lessonsPerPage = 2; // מספר שיעורים לעמוד (עודכן ל-2)

  constructor(
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LessonFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number; lesson?: LessonData }
  ) {
    if (data.lesson) {
      this.isEditMode = 'edit'; // מצב עריכה
      this.lesson.set(data.lesson);
    }
  }

  ngOnInit(): void {
    this.loadLessons();
  }

  // טוען את רשימת השיעורים
  loadLessons(): void {
    this.coursesService.getLessons(this.data.courseId).subscribe(
      (lessons) => this.lessons.set(lessons),
      (error) => console.error('Failed to load lessons', error)
    );
  }

  // פונקציה לדפדוף
  paginatedLessons(): LessonData[] {
    const startIndex = (this.currentPage - 1) * this.lessonsPerPage;
    const endIndex = startIndex + this.lessonsPerPage;
    return this.lessons().slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.lessons().length / this.lessonsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // הוספת שיעור חדש
  addLesson(): void {
    const newLesson = this.lesson();
    this.coursesService.createLesson(this.data.courseId, newLesson).subscribe(
      () => {
        this.loadLessons();
        this.lesson.set({ title: '', content: '' }); // איפוס הטופס
      },
      (error) => console.error('Failed to add lesson', error)
    );
  }

  // עריכת שיעור קיים
  editLesson(lesson: LessonData): void {
    this.lesson.set(lesson); // טוען את השיעור לעריכה
    this.isEditMode = 'edit';
  }

  // שמירת השיעור לאחר עריכה
  saveLesson(): void {
    const updatedLesson = this.editedLesson();
    if (this.isEditMode === 'edit' && updatedLesson?.id) {
      // עריכת שיעור קיים
      this.coursesService.updateLesson(this.data.courseId, updatedLesson.id, updatedLesson).subscribe(
        () => {
          this.loadLessons();
          this.cancelEdit();
          this.showMessage('השיעור עודכן בהצלחה');
        },
        (error) => {
          console.error('Failed to update lesson', error);
          this.showMessage('שגיאה בעדכון השיעור', true);
        }
      );
    } else if (this.isEditMode === 'add') {
      // הוספת שיעור חדש
      this.coursesService.createLesson(this.data.courseId, updatedLesson!).subscribe(
        () => {
          this.loadLessons();
          this.cancelEdit(); // חזרה למצב רגיל
          this.showMessage('השיעור נוסף בהצלחה'); // הצגת הודעה
        },
        (error) => {
          console.error('Failed to add lesson', error);
          this.showMessage('שגיאה בהוספת השיעור', true); // הודעת שגיאה
        }
      );
    }
  }

  // מחיקת שיעור
  deleteLesson(lessonId: number): void {
    if (confirm('האם אתה בטוח שאתה רוצה למחוק את השיעור הזה?')) {
      this.coursesService.deleteLesson(this.data.courseId, lessonId).subscribe(
        () => this.loadLessons(),
        (error) => console.error('Failed to delete lesson', error)
      );
    }
  }

  startAddingLesson(): void {
    this.isEditMode = 'add';
    this.editedLesson.set({ title: '', content: '' }); // איפוס הטופס
  }

  startEditingLesson(lesson: LessonData): void {
    this.isEditMode = 'edit';
    this.editedLesson.set({ ...lesson }); // יצירת עותק לעריכה
  }

  cancelEdit(): void {
    this.isEditMode = null; // חזרה למצב רגיל
    this.editedLesson.set({ title: '', content: '' }); // איפוס הטופס
  }

  // ביטול פעולה
  onCancel(): void {
    this.dialogRef.close();
  }

  // updateLessonTitle(lesson: LessonData, event: FocusEvent): void {
  //   const newTitle = (event.target as HTMLElement).innerText.trim();
  //   if (newTitle && newTitle !== lesson.title) {
  //     lesson.title = newTitle;
  //     this.coursesService.updateLesson(this.data.courseId, lesson.id!, lesson).subscribe(
  //       () => console.log('Lesson title updated successfully'),
  //       (error) => console.error('Failed to update lesson title', error)
  //     );
  //   }
  // }

  trackByLessonId(index: number, lesson: LessonData): number | undefined {
    return lesson.id;
  }

  showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar',
    });
  }
}
