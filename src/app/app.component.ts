import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";


@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OnlineCourse';
  isLoggedIn: boolean = false;
}
