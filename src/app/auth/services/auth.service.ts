
import { computed, Injectable, signal, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // אופציונלי, לא תמיד נרצה להחזיר את הסיסמה
  role: string;
}

@Injectable({
  providedIn: 'root', // הספק זמין לכל האפליקציה
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // URL של ה-API שלך
  // private token: string | null = null; // משתנה לאחסון הטוקן
  private _currentUser = signal<User | null>(null);
  private _currentUserId = signal<number | null>(null);

  isAuthenticated = computed(() => !!this._currentUser());
  userName = computed(() => this._currentUser()?.name || null);
  userRole = computed(() => this._currentUser()?.role || null);
  // userId = computed(() => this._currentUser()?.id || null);

  constructor(private http: HttpClient) {
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
          console.log(this._currentUser());
          console.log('user name:', this.userName());
          
        }),
        catchError(error => {
          console.error('Failed to load user profile', error);
          this.clearToken(); // אם הטוקן לא תקין, נתנתק
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
      console.log(response);
      this._currentUserId.set(response.userId);
      localStorage.setItem('token', response.token || '');
      // לאחר התחברות מוצלחת, טען את פרופיל המשתמש
      this.loadUserProfile();
    }),
    catchError((error) => {
      console.error('Login error', error);
      return throwError(error);
    })
  );
}
  /**
   * רישום משתמש חדש
   * @param name שם המשתמש
   * @param email כתובת דוא"ל
   * @param password סיסמה
   * @param role תפקיד המשתמש (student, teacher, admin)
   * @returns Observable עם תגובת השרת
   */
  register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Observable<any> {
    const payload = { name, email, password, role };
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  /**
   * פונקציה לקבלת תיאור התפקיד
   * @param role תפקיד המשתמש
   * @returns תיאור התפקיד בעברית
   */
  getRoleDescription(role: string): string {
    const roles: { [key: string]: string } = {
      student: 'תלמיד',
      teacher: 'מורה',
      admin: 'מנהל',
    };
    return roles[role] || 'תפקיד לא ידוע';
  }
  /**
 * שמירת טוקן ב-Local Storage
 * @param token הטוקן שהתקבל מהשרת
 */
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * שליפת הטוקן מ-Local Storage
   * @returns הטוקן או null אם לא קיים
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * מחיקת הטוקן מ-Local Storage (התנתקות)
   */
   clearToken(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
   }
  
}
