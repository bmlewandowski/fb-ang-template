import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatTooltip],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  currentYear: number | undefined;

  ngOnInit(): void {
    this.currentYear = (new Date()).getFullYear()
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
        })
      }
      else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig());
    });
  }

  logout(): void {
    this.authService.logout();
    console.log('logout');
  }
}
