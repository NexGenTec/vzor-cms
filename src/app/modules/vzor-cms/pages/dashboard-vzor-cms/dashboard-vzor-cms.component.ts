import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VzorCmsHeaderComponent } from './components/vzor-cms-header/vzor-cms-header.component';
import { VzorCmsDualCardComponent } from './components/vzor-cms-dual-card/vzor-cms-dual-card.component';
import { VzorCmsSingleCardComponent } from './components/vzor-cms-single-card/vzor-cms-single-card.component';
import { VzorCmsChartCardComponent } from './components/vzor-cms-chart-card/vzor-cms-chart-card.component';
import { VzorCmsContentTableComponent } from './components/vzor-cms-content-table/vzor-cms-content-table.component';
import { BlogService } from '../../services/blog.service';
import { RecursosService } from '../../services/recursos.service';
import { ReviewClientesService } from '../../services/review-clientes.service';
import { BlogPost } from '../../models/blog.model';
import { Recurso } from '../../models/recursos.model';
import { ReviewCliente } from '../../models/review-clientes.model';

@Component({
  selector: 'app-dashboard-vzor-cms',
  standalone: true,
  imports: [
    VzorCmsHeaderComponent,
    VzorCmsDualCardComponent,
    VzorCmsSingleCardComponent,
    VzorCmsChartCardComponent,
    VzorCmsContentTableComponent,
    NgIf,
    NgStyle,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dashboard-vzor-cms.component.html',
  styleUrl: './dashboard-vzor-cms.component.scss'
})
export class DashboardVzorCmsComponent {
  blogPosts = signal<BlogPost[]>([]);
  recursos = signal<Recurso[]>([]);
  reviews = signal<ReviewCliente[]>([]);
  isLoading = true;

  // Estadísticas computadas
  totalBlogPosts = computed(() => this.blogPosts().length);
  publishedPosts = computed(() => this.blogPosts().filter(post => post.category !== 'Borrador').length);
  draftPosts = computed(() => this.blogPosts().filter(post => post.category === 'Borrador').length);
  totalRecursos = computed(() => this.recursos().length);
  totalDownloads = computed(() => this.recursos().reduce((sum, r) => sum + (r.downloads || 0), 0));
  totalReviews = computed(() => this.reviews().length);
  averageRating = computed(() => {
    const total = this.reviews().length;
    if (total === 0) return 0;
    const sum = this.reviews().reduce((acc, review) => acc + review.rating, 0);
    return (sum / total);
  });
  totalContent = computed(() => this.totalBlogPosts() + this.totalRecursos() + this.totalReviews());

  constructor(
    private blogService: BlogService,
    private recursosService: RecursosService,
    private reviewClientesService: ReviewClientesService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;

    this.blogService.getBlogPosts().subscribe({
      next: (posts) => this.blogPosts.set(posts),
      error: (error) => console.error('Error loading blog posts:', error)
    });

    this.recursosService.getRecursos().subscribe({
      next: (recursos) => this.recursos.set(recursos),
      error: (error) => console.error('Error loading resources:', error)
    });

    this.reviewClientesService.getReviews().subscribe({
      next: (reviews: ReviewCliente[]) => {
        this.reviews.set(reviews);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading client reviews:', error);
        this.isLoading = false;
      }
    });
  }

  getRecentPosts(): BlogPost[] {
    return this.blogPosts().slice(0, 2);
  }

  getRecentRecursos(): Recurso[] {
    return this.recursos().slice(0, 2);
  }

  getRecentReviews(): ReviewCliente[] {
    return this.reviews().slice(0, 2);
  }
}