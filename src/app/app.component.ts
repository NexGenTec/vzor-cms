import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { NgxSonnerToaster } from 'ngx-sonner';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster,RouterModule],
})
export class AppComponent {
  title = ' vzor-cms';
  constructor(public themeService: ThemeService) {}
}
