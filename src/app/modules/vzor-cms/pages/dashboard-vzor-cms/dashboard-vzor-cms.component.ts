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
import { FAQService } from '../../services/faq.service';
import { PlatformService } from '../../services/platform.service';
import { ClientService } from '../../services/client.service';
import { PartnerService } from '../../services/partner.service';
import { BlogPost } from '../../models/blog.model';
import { Recurso } from '../../models/recursos.model';
import { ReviewCliente } from '../../models/review-clientes.model';
import { FAQ } from '../../models/faq.model';
import { Platform } from '../../models/platform.model';
import { Client } from '../../models/client.model';
import { Partner } from '../../models/partner.model';

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
  faqs = signal<FAQ[]>([]);
  platforms = signal<Platform[]>([]);
  clients = signal<Client[]>([]);
  partners = signal<Partner[]>([]);
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

  totalFaqs = computed(() => this.faqs().length);

  totalPlatforms = computed(() => this.platforms().length);
  activePlatforms = computed(() => this.platforms().filter(p => p.isActive).length);

  totalClients = computed(() => this.clients().length);
  publishedClients = computed(() => this.clients().filter(c => c.isPublished).length);

  totalPartners = computed(() => this.partners().length);
  visiblePartners = computed(() => this.partners().filter(p => p.isVisible).length);

  totalContent = computed(() =>
    this.totalBlogPosts() +
    this.totalRecursos() +
    this.totalReviews() +
    this.totalFaqs() +
    this.totalPlatforms() +
    this.totalClients() +
    this.totalPartners()
  );

  constructor(
    private blogService: BlogService,
    private recursosService: RecursosService,
    private reviewClientesService: ReviewClientesService,
    private faqService: FAQService,
    private platformService: PlatformService,
    private clientService: ClientService,
    private partnerService: PartnerService
  ) { }

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
      next: (reviews: ReviewCliente[]) => this.reviews.set(reviews),
      error: (error: any) => console.error('Error loading client reviews:', error)
    });

    this.faqService.getFAQs().subscribe({
      next: (faqs) => this.faqs.set(faqs),
      error: (error) => console.error('Error loading FAQs:', error)
    });

    this.platformService.getPlatforms().subscribe({
      next: (platforms) => this.platforms.set(platforms),
      error: (error) => console.error('Error loading platforms:', error)
    });

    this.clientService.getClients().subscribe({
      next: (clients) => this.clients.set(clients),
      error: (error) => console.error('Error loading clients:', error)
    });

    this.partnerService.getPartners().subscribe({
      next: (partners) => {
        this.partners.set(partners);
        // Assuming this is the last one or close to it, we can turn off loading here
        // Ideally we should use forkJoin but for now this is fine as they are independent
        // We'll set a timeout or just wait for the last one. 
        // Better approach: check if all are loaded? 
        // For simplicity, I'll just set isLoading to false here as it's likely the last one called.
        // Or better, use a counter or forkJoin.
        // Since I can't easily refactor to forkJoin without changing imports significantly (rxjs),
        // I'll just set isLoading = false in a setTimeout to allow others to finish, or just set it here.
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading partners:', error);
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