import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';

import { CourseDetailsComponent } from './courses/components/course-details/course-details.component';
import { CourseManagementComponent } from './courses/components/course-management/course-management.component';
import { HomeComponent } from './shared/components/home/home.component';
import { CoursesComponent } from './courses/components/courses/courses.component';
import { authGuard } from './auth/auth.guard';
import { teacherGuard } from './auth/teacher.guard';

export const routes: Routes = [
      { path: '', component: HomeComponent, pathMatch: 'full' }, // נתיב ברירת מחדל
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { 
        path: 'courses', 
        component: CoursesComponent,
        canActivate: [authGuard] 
    },
    { 
        path: 'course-details/:id', 
        component: CourseDetailsComponent,
        canActivate: [authGuard] 
    },
    { 
        path: 'course-management', 
        component: CourseManagementComponent,
        canActivate: [teacherGuard] 
    },

];
