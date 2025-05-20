import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const teacherGuard: CanActivateFn = (route, state): 
  boolean 
  | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.userRole();

  if (isAuthenticated && userRole === 'teacher') {
    return true;
  }

  // אם המשתמש לא מאומת או אינו מורה
  if (!isAuthenticated) {
    snackBar.open('עליך להתחבר כדי לגשת לדף זה.', 'סגור', {
      duration: 3000,
      verticalPosition: 'top'
    });
    return router.createUrlTree(['/login']);
  } else {
    // המשתמש מאומת אך אינו מורה
    snackBar.open('הגישה לניהול קורסים מותרת למורים בלבד.', 'סגור', { 
      duration: 3500, 
      verticalPosition: 'top'
    });
    // אפשר להפנות לדף הבית או לדף אחר מתאים
    return router.createUrlTree(['/']); 
  }
};
