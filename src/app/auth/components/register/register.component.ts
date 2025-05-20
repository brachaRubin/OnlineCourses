import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    NgIf,
    MatIcon,
    MatInput,
    MatIconButton,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hide = true;
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.passwordControl,
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.value;

      this.authService.register(name, email, password, role).subscribe({
        next: (response) => {
          // console.log('משתמש נרשם בהצלחה:', response);
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
