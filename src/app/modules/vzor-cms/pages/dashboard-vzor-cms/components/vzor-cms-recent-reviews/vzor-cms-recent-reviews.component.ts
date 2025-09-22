import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ReviewCliente } from '../../../../models/review-clientes.model';

@Component({
  selector: 'app-vzor-cms-recent-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularSvgIconModule],
  templateUrl: './vzor-cms-recent-reviews.component.html',
  styleUrl: './vzor-cms-recent-reviews.component.scss'
})
export class VzorCmsRecentReviewsComponent {
  @Input() reviews: ReviewCliente[] = [];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }
}
