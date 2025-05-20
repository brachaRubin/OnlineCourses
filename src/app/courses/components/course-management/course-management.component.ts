import { Component, OnInit, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';
import { CoursesService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CourseFormDialogComponent } from '../dialogs/course-form-dialog/course-form-dialog.component';
import { LessonFormDialogComponent } from '../dialogs/lesson-form-dialog/lesson-form-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-course-management',
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent implements OnInit {
  courses = signal<Course[]>([]); // רשימת הקורסים

  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCourses(); // טוען את רשימת הקורסים עם פתיחת הקומפוננטה
  }

  // פונקציה לטעינת כל הקורסים מהשרת
  loadCourses(): void {
    this.coursesService.getCourses().subscribe(
      (data) => this.courses.set(data),
      (error) => this.showMessage('טעינת הקורסים נכשלה', true)
    );
  }

  // פונקציה להוספת קורס חדש
  addCourse(): void {
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '500px',
      data: { isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result); // בדוק מה הנתונים שחוזרים מהדיאלוג
      if (result) {
        this.coursesService.createCourse(result).subscribe(
          (response) => {
            console.log('API Response:', response);
            const newCourse = { ...result, id: response.id };
            console.log('New Course:', newCourse);
            this.courses.update((courses) => [...courses, newCourse]);
            this.showMessage('הקורס נוסף בהצלחה');
          },
          (error) => {
            console.error('Failed to add course:', error);
            this.showMessage('שגיאה בהוספת הקורס', true);
          }
        );
      }
    });
  }

  // פונקציה לעריכת קורס קיים
  editCourse(course: Course): void {
    const dialogRef = this.dialog.open(CourseFormDialogComponent, {
      width: '500px',
      data: { course, isEdit: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.coursesService.updateCourse(course.id!, result).subscribe(
          () => {
            this.courses.update((courses) =>
              courses.map((c) => (c.id === course.id ? { ...course, ...result } : c))
            );
            this.showMessage('הקורס עודכן בהצלחה');
          },
          () => this.showMessage('עדכון הקורס נכשל', true)
        );
      }
    });
  }

  // פונקציה למחיקת קורס קיים
  deleteCourse(courseId: number): void {
    if (confirm('אתה בטוח שברצונך למחוק את הקורס?')) {
      this.coursesService.deleteCourse(courseId).subscribe(
        () => {
          this.courses.update((courses) =>
            courses.filter((course) => course.id !== courseId)
          );
          this.showMessage('הקורס נמחק בהצלחה');
        },
        () => this.showMessage('שגיאה במחיקת הקורס', true)
      );
    }
  }
  // פונקציה לפתיחת דיאלוג להוספת שיעורים לקורס

  openLessons(course: Course): void {
    const dialogRef = this.dialog.open(LessonFormDialogComponent, {
      width: '600px',
      data: { courseId: course.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCourses(); // רענון רשימת הקורסים לאחר עדכון שיעורים
      }
    });
  }



  // הצגת הודעות הצלחה/שגיאה
  private showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'snackbar-error' : 'snackbar-success',
    });
  }
}
