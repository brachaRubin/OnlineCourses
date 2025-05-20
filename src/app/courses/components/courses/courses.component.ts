import { Component, computed, OnInit, signal } from '@angular/core';
import { CoursesService } from '../../services/course.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseDetailsComponent } from '../course-details/course-details.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-courses',
  imports: [NgIf, MatIconModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses = signal<any[]>([]); // רשימת כל הקורסים
  enrolledCourses = signal<number[]>([]); // מזהי הקורסים שהמשתמש רשום אליהם
  selectedCourseId = signal<number | null>(null); // ID של הקורס שנבחר
  isToggling: boolean = false; // מנגנון למניעת לחיצות כפולות
  // selectedCourse = signal<any>(null);
  userId$ = signal<number | null>(null); // מזהה המשתמש
  userRole$ = computed(() => this.authService.userRole());
  imageUrl = '/images/homePage.jpg';

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) { }

  isLoading = signal<boolean>(true); // מצב טעינה

  ngOnInit(): void {
    this.isLoading.set(true); // התחלת טעינה
    this.loadCourses();
    this.userId$.set(this.authService.userId());
    // const studentId = this.getStudentId();
    // if (studentId && studentId > 0) {
    //   this.loadEnrolledCourses(studentId);
    // } else {
    //   console.error('Invalid student ID:', studentId);
    // }
    const userId = this.userId$();
    if (userId !== null) {
      this.loadEnrolledCourses(userId);
    } else {
      console.error('Invalid user ID:', userId);
    }
  console.log(this.userId$());
  
    this.isLoading.set(false); // סיום טעינה
  }
  
  // getStudentId(): number {
  //   // קבלת ה-ID מתוך Local Storage
  //   const id = localStorage.getItem('userId');
  //   return id ? parseInt(id, 10) : 0; // החזר ברירת מחדל (0) אם ה-ID לא קיים
  // }

  // טעינת רשימת הקורסים מהשרת
  loadCourses() {
    this.coursesService.getCourses().subscribe(
      (data) => this.courses.set(data),
      (error) => console.error('Error loading courses:', error)
    );
  }

  // טעינת רשימת הקורסים שהמשתמש רשום אליהם
  loadEnrolledCourses(studentId: number): void {
    this.coursesService.getEnrolledCourses(studentId).subscribe({
      next: (data) => {
        const enrolledCourseIds = data.map(course => course.id);
        this.enrolledCourses.set(enrolledCourseIds);
        console.log('Updated enrolledCourses:', this.enrolledCourses());
      },
      error: (err) => {
        console.error('Error loading enrolled courses:', err);
        alert('Failed to load enrolled courses.');
      }
    });
  }

  toggleEnrollment(courseId: number): void {
    console.log('Toggling enrollment for course:', courseId);
    const isEnrolled = this.enrolledCourses().includes(courseId);
    console.log('Is enrolled:', isEnrolled);

    if (this.isToggling) {
      console.warn('Already toggling. Please wait.');
      return;
    }
    this.isToggling = true;

    const userId = this.userId$();
    console.log('User ID:', userId);

    if (isEnrolled) {
      console.log('Leaving course...');
      if (userId !== null) {
        this.coursesService.leaveCourse(courseId, userId).subscribe({
          next: () => {
            console.log(`Successfully left course ${courseId}`);
            this.enrolledCourses.set(this.enrolledCourses().filter((id) => id !== courseId));
              this.snackbar.open('עזבת את הקורס בהצלחה', 'סגור', {
            duration: 3000,
          });
          },
          error: (err) => {
            console.error(`Failed to leave course ${courseId}:`, err);
            alert('Failed to leave the course. Please try again.');
          },
          complete: () => {
            this.isToggling = false;
          },
        });
      } else {
        console.error('User ID is null. Cannot leave course.');
        alert('User ID is invalid. Please log in again.');
        this.isToggling = false;
      }
    } else {
      console.log('Enrolling in course...');
      if (userId !== null) {
        this.coursesService.enrollInCourse(courseId, userId).subscribe({
          next: () => {
            console.log(`Successfully enrolled in course ${courseId}`);
            this.enrolledCourses.set([...this.enrolledCourses(), courseId]);
            this.snackbar.open('נרשמת לקורס בהצלחה', 'סגור', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error(`Failed to enroll in course ${courseId}:`, err);
            alert('Failed to enroll in the course. Please try again.');
          },
          complete: () => {
            this.isToggling = false;
          },
        });
      } else {
        console.error('User ID is null. Cannot enroll in course.');
        alert('User ID is invalid. Please log in again.');
        this.isToggling = false;
      }
    }
  }

  viewCourseDetails(courseId: number): void {
    const isEnrolled = this.enrolledCourses().includes(courseId);

    if (!isEnrolled) {
      this.dialog.open(AlertComponent, {
        data: {
          title: 'שגיאה',
          message: 'אינך רשום לקורס זה ולכן אינך יכול לצפות בפרטיו.'
        }
      });
      return;
    }
    this.router.navigate(['/course-details', courseId]); // ניווט למסך פרטי הקורס
  }
  removeCourse(courseId: number): void {
    // בודקים אם הקורס קיים ברשימה
    if (!this.enrolledCourses().includes(courseId)) {
      console.error(`Course ${courseId} is not enrolled and cannot be removed.`);
      return;
    }

  }
}
