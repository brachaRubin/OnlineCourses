import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service'; // Adjusted path for AuthService
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state): 
  boolean 
  | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // AuthService.isAuthenticated היא computed signal, אז נקרא אותה כפונקציה
  if (authService.isAuthenticated()) {
    return true;
  }

  // אם המשתמש לא מאומת
  snackBar.open('עליך להתחבר או להירשם כדי לגשת לדף זה.', 'סגור', {
    duration: 3000,
    verticalPosition: 'top'
  });
  return router.createUrlTree(['/login']);
};
