import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-vzor-cms-chart-card',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './vzor-cms-chart-card.component.html',
  styleUrl: './vzor-cms-chart-card.component.scss'
})
export class VzorCmsChartCardComponent implements OnInit {
  @Input() totalPosts: number = 0;
  @Input() totalRecursos: number = 0;
  @Input() totalReviews: number = 0;

  isLoading = false;
  contentStats = {
    total: 0,
    posts: 0,
    recursos: 0,
    reviews: 0,
    completionRate: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    
    // Simular carga de datos
    setTimeout(() => {
      this.contentStats = {
        total: this.totalPosts + this.totalRecursos + this.totalReviews,
        posts: this.totalPosts,
        recursos: this.totalRecursos,
        reviews: this.totalReviews,
        completionRate: this.calculateCompletionRate()
      };
      this.isLoading = false;
    }, 1000);
  }

  private calculateCompletionRate(): number {
    const total = this.totalPosts + this.totalRecursos + this.totalReviews;
    if (total === 0) return 0;
    
    // Simular un cálculo de progreso basado en el contenido
    const publishedContent = this.totalPosts + this.totalRecursos;
    return Math.round((publishedContent / total) * 100);
  }
}