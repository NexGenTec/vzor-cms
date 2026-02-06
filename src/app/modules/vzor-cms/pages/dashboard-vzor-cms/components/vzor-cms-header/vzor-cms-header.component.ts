import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vzor-cms-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vzor-cms-header.component.html',
  styleUrl: './vzor-cms-header.component.scss'
})
export class VzorCmsHeaderComponent {
  currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor(private router: Router) {}

  navigateToRecursos(): void {
    this.router.navigate(['/vzor-cms/recursos']);
  }
}
