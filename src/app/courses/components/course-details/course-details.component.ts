
import { Component, Input, OnInit, signal } from '@angular/core';
import { CoursesService } from '../../services/course.service';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LessonCardComponent } from '../../lesson-card/lesson-card.component';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule,LessonCardComponent],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  courseId!: number; // מזהה הקורס שמתקבל מהניווט
  courseDetails: any = null; // פרטי הקורס
  lessons: any[] = []; // רשימת השיעורים
  imageUrl = '/images/homePage.jpg';
   selectedLesson = signal<any>(null);
  selectedLessonIndex = signal<number>(-1);

  constructor(
    private route: ActivatedRoute, // לקבלת ה-id מהניווט
    private coursesService: CoursesService // שירות לטעינת פרטי הקורס והשיעורים
  ) {}

  ngOnInit(): void {
    // קבלת ה-id של הקורס מהנתיב
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = +id;
      this.loadCourseDetails(); // טעינת פרטי הקורס
      this.loadLessons(); // טעינת רשימת השיעורים
    } else {
      console.error('Course ID is missing in the route.');
    }
  }

  // טעינת פרטי הקורס
  loadCourseDetails(): void {
    this.coursesService.getCourseById(this.courseId).subscribe(
      (data) => {
        this.courseDetails = data;
        console.log('Course details loaded:', data);
      },
      (error) => {
        console.error('Error loading course details:', error);
      }
    );
  }

  // טעינת רשימת השיעורים
  loadLessons(): void {
    this.coursesService.getLessons(this.courseId).subscribe(
      (data) => {
        this.lessons = data;
        console.log('Lessons loaded:', data);
      },
      (error) => {
        console.error('Error loading lessons:', error);
      }
    );
  }
    onLessonSelected(lessonId: number): void {
    this.selectedLessonIndex.set(this.lessons.findIndex(lesson => lesson.id === lessonId));
    this.selectedLesson.set(this.lessons[this.selectedLessonIndex()]);
    console.log('Selected lesson:', this.selectedLesson());
    
  }
}
