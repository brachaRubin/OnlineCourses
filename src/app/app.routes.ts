import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CourseListComponent } from './courses/components/course-list/course-list.component';
import { CourseDetailsComponent } from './courses/components/course-details/course-details.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'courses', component: CourseListComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // הפניה לדף הבית
    { path: 'course-details/:id', component: CourseDetailsComponent }
];
