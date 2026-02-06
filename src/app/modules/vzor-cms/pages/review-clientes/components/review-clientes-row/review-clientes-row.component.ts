import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { ReviewCliente } from '../../../../models/review-clientes.model';

@Component({
  selector: '[app-review-clientes-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './review-clientes-row.component.html',
  styleUrl: './review-clientes-row.component.scss'
})
export class ReviewClientesRowComponent {
  @Input() review!: ReviewCliente;
  @Input() onEditReview!: (review: ReviewCliente) => void;
  @Output() editReview = new EventEmitter<ReviewCliente>();
  @Output() deleteReview = new EventEmitter<number>();

  constructor(private router: Router) {}

  onEdit(): void {
    this.editReview.emit(this.review);
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.deleteReview.emit(this.review.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getProjectType(project: string): string {
    if (project.includes('Residencial') || project.includes('Casa') || project.includes('Edificio Residencial')) {
      return 'Residencial';
    } else if (project.includes('Comercial') || project.includes('Centro Comercial')) {
      return 'Comercial';
    } else if (project.includes('Corporativa') || project.includes('Oficinas')) {
      return 'Corporativo';
    } else if (project.includes('Industrial')) {
      return 'Industrial';
    }
    return 'Residencial';
  }

  viewReview(id: number): void {
    this.router.navigate(['/layout/vzor-cms/review-clientes', id.toString()]);
    toast.info(`Viendo reseña: ${this.review.clientName}`);
  }
}