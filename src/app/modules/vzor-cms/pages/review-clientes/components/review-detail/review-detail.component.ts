import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { ReviewClientesService } from '../../../../services/review-clientes.service';
import { ReviewCliente } from '../../../../models/review-clientes.model';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss'
})
export class ReviewDetailComponent implements OnInit {
  review: ReviewCliente | undefined;
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private reviewClientesService = inject(ReviewClientesService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reviewClientesService.getReviewById(parseInt(id)).subscribe({
        next: (review: ReviewCliente | undefined) => {
          this.review = review;
        },
        error: (error: any) => {
          toast.error('Error al cargar la reseña');
          console.error(error);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

}
