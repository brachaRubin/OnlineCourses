import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CourseListComponent } from './courses/components/course-list/course-list.component';
import { CourseDetailsComponent } from './courses/components/course-details/course-details.component';
import { CourseManagementComponent } from './courses/components/course-management/course-management.component';
import { HomeComponent } from './shared/home/home.component';
import { CoursesComponent } from './courses/components/courses/courses.component';
export const routes: Routes = [
      { path: '', component: HomeComponent, pathMatch: 'full' }, // נתיב ברירת מחדל
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CoursesComponent },
    // { path: '', redirectTo: '/login', pathMatch: 'full' }, // הפניה לדף הבית
    { path: 'course-details/:id', component: CourseDetailsComponent },
    { path: 'course-management', component: CourseManagementComponent },
    // { path: '', redirectTo: '/course-management', pathMatch: 'full' }
];
