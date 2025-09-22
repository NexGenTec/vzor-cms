import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Recurso } from '../../../../models/recursos.model';

@Component({
  selector: 'app-vzor-cms-recent-recursos',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularSvgIconModule],
  templateUrl: './vzor-cms-recent-recursos.component.html',
  styleUrl: './vzor-cms-recent-recursos.component.scss'
})
export class VzorCmsRecentRecursosComponent {
  @Input() recursos: Recurso[] = [];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  }

  getTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pdf': return 'assets/icons/heroicons/outline/document.svg';
      case 'excel': return 'assets/icons/heroicons/outline/table-cells.svg';
      case 'video': return 'assets/icons/heroicons/outline/video-camera.svg';
      case 'software': return 'assets/icons/heroicons/outline/code-bracket.svg';
      case 'imagen': return 'assets/icons/heroicons/outline/photo.svg';
      default: return 'assets/icons/heroicons/outline/document.svg';
    }
  }
}
