import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private _currentUser = signal<User | null>(null);
  private _currentUserId = signal<number | null>(null);

  isAuthenticated = computed(() => !!this._currentUser());
  userName = computed(() => this._currentUser()?.name || null);
  userRole = computed(() => this._currentUser()?.role || null);
  userId = computed(() => this._currentUser()?.id || null);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.loadUserProfile();
    }
  }

  private loadUserProfile(): void {
    console.log('Loading user profile...');
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get<User>(`http://localhost:3000/api/users/${this._currentUserId()}`, { headers }).pipe(
        tap(profile => {
          this._currentUser.set(profile);
          console.log('User name:', this.userName());
          this.router.navigate(['/courses']);
        }),
        catchError(error => {
          console.error('Failed to load user profile', error);
          this.clearToken();
          this.router.navigate(['/login']);
          return throwError(error);
        })
      ).subscribe();
    } else {
      console.log('No token found, user is not authenticated');
      this._currentUser.set(null);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ userId: number; token?: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        // console.log('Login response:', response);
        if (response.token && response.userId) {
          localStorage.setItem('token', response.token);
          this._currentUserId.set(response.userId);
          this.loadUserProfile();
        } else {
          console.error('Login response missing token or userId');
        }
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError(error);
      })
    );
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    const payload = { name, email, password, role };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  getRoleDescription(role: string): string {
    const roles: { [key: string]: string } = {
      student: 'תלמיד',
      teacher: 'מורה',
      admin: 'מנהל',
    };
    return roles[role] || 'תפקיד לא ידוע';
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._currentUserId.set(null);
    // No navigation from here in the reverted state, router.navigate was in HeaderComponent or guards
  }
}
