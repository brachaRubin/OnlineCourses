
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root', // הספק זמין לכל האפליקציה
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; // URL של ה-API שלך
  // private token: string | null = null; // משתנה לאחסון הטוקן

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
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
    }
  // שאר הפונקציות נשארות כפי שהן
}
