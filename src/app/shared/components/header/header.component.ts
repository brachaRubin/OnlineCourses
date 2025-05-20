import { Component, computed, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterModule, NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username = computed(() => this.authService.userName());
  userRole = computed(() => this.authService.userRole());
  isLoggedIn$ = computed(() => this.authService.isAuthenticated());
  avatarInitial = computed(() => {
    const name = this.authService.userName();
    return name ? name.charAt(0).toUpperCase() : '';
  });


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }
}
