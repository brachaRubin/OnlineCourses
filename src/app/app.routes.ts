import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CourseListComponent } from './courses/components/course-list/course-list.component';
import { CourseDetailsComponent } from './courses/components/course-details/course-details.component';
import { CourseManagementComponent } from './courses/components/course-management/course-management.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CourseListComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // הפניה לדף הבית
    { path: 'course-details/:id', component: CourseDetailsComponent },
    { path: 'course-management', component: CourseManagementComponent },
    { path: '', redirectTo: '/course-management', pathMatch: 'full' }
];
