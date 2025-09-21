import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../management/models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth.service';
import { UserService } from '../../../management/service/user.service';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent {
  public user!: User;

  constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userService.getUserData(user.uid).subscribe(user => {
          this.user = user;
        });
      }
    });
  }

}
