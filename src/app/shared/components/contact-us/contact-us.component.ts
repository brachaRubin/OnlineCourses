import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // For icons next to contact details

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  title = input<string>('יצירת קשר');

  // Placeholder contact details - you can make these inputs or fetch them if needed later
  contactInfo = {
    email: 'info@onlinecourse.com',
    phone: '050-1234567',
    address: 'בני ברק' // Changed address
  };

  constructor() {}
}
