import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
