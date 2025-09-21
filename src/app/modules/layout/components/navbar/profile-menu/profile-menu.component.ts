import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../../auth/service/auth.service';
import { toast } from 'ngx-sonner';
import { User } from '../../../../management/models/user';
import { UserService } from '../../../../management/service/user.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, AngularSvgIconModule,CommonModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public themeColors = [
    {
      name: 'red',
      code:'#cc0022',
    },
    // {
    //   name: 'blue',
    //   code: '#3b82f6',
    // },
  ];

  public themeMode = ['light', 'dark'];
  user!: User;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserData(this.user?.uid).subscribe(data => {
      this.user = data || {}; 
    });
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userService.getUserData(user.uid).subscribe(userData => {
          this.user = userData;
        });
      }
    });
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      toast.success('Sesión cerrada exitosamente', { position: 'top-right' });
    } catch (error:any) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al iniciar sesión: ' + error.message, {
        position: 'top-right',
      });
    }
  }

  goToProfile() {
    if (this.user) {
      this.router.navigate(['/layout/profile/profile-user', this.user.uid]); // Redirigir con el UID
    }
  }
}
