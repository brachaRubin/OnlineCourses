import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService,private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;

      this.authService.register(name, email, password, role).subscribe({
        next: (response) => {
          console.log('משתמש נרשם בהצלחה:', response);
          this.authService.saveToken(response.token); // שמירת הטוקן
          alert('נרשמת בהצלחה!');
        },
        error: (err) => {
          console.error('שגיאה בהרשמה:', err);
          alert('הרשמה נכשלה, אנא נסה שוב.');
        },
      });
    }
  }
}
