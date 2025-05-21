import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';

// מודל לקורס


// מודל לשיעור


@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private baseUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }

  // פונקציה לניהול כותרות
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // עדיף להשתמש ב-HttpInterceptor במקום
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // טיפול בשגיאות HTTP
  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(() => new Error(error.message || 'שגיאה בשרת'));
  }

  // פונקציות כלליות לכל המשתמשים
  getCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCourseById(id: number): Observable<Course> {
    return this.http
      .get<Course>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getEnrolledCourses(studentId: number): Observable<{ id: number, title: string, description: string, teacherId: number }[]> {
    if (!studentId || studentId <= 0) {
      console.error('Invalid student ID:', studentId);
      return throwError(() => new Error('Invalid student ID'));
    }

    return this.http.get<{ id: number, title: string, description: string, teacherId: number }[]>(`${this.baseUrl}/student/${studentId}`, { headers: this.getHeaders() });
  }
  enrollInCourse(courseId: number, userId: number): Observable<void> {
    console.log('Enrolling in course:', { courseId, userId }); // לוג לבדיקה
    return this.http.post<void>(
      `${this.baseUrl}/${courseId}/enroll`,
      { userId }, // שליחת userId בגוף הבקשה
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => {
        console.error('Error enrolling in course:', error);
        return throwError(() => new Error('Failed to enroll in course'));
      })
    );
  }

  leaveCourse(courseId: number, userId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${courseId}/unenroll`,
      {
        headers: this.getHeaders(),
        body: { userId } // שליחת userId בגוף הבקשה
      }
    );
  }

  getLessons(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>(`${this.baseUrl}/${courseId}/lessons`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${courseId}/lessons`, { headers: this.getHeaders() });
  }

  // פונקציות למורים בלבד
  private getTeacherId(): number {
    const teacherId = localStorage.getItem('userId');
    if (!teacherId) {
      throw new Error('Teacher ID is not found in localStorage');
    }
    return parseInt(teacherId, 10); // המרה למספר שלם
  }
  createCourse(course: Omit<Course, 'teacherId'>): Observable<Course> {
    const teacherId = this.getTeacherId(); // לקיחת ה-teacherId מתוך localStorage
    const courseWithTeacherId = { ...course, teacherId };

    return this.http
      .post<Course>(this.baseUrl, courseWithTeacherId, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCourse(courseId: number, course: Omit<Course, 'teacherId'>): Observable<Course> {
    const teacherId = this.getTeacherId(); // לקיחת ה-teacherId מתוך localStorage
    const courseWithTeacherId = { ...course, teacherId };

    return this.http
      .put<Course>(`${this.baseUrl}/${courseId}`, courseWithTeacherId, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }


  deleteCourse(courseId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${courseId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createLesson(courseId: number, lesson: Lesson): Observable<Lesson> {
    return this.http
      .post<Lesson>(`${this.baseUrl}/${courseId}/lessons`, lesson, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateLesson(courseId: number, lessonId: number, lesson: Lesson): Observable<Lesson> {
    return this.http
      .put<Lesson>(`${this.baseUrl}/${courseId}/lessons/${lessonId}`, lesson, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}