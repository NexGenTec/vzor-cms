import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { ReviewClientesService } from '../../services/review-clientes.service';
import { ReviewCliente, CreateReviewRequest } from '../../models/review-clientes.model';
import { ReviewClientesHeaderComponent } from './components/review-clientes-header/review-clientes-header.component';
import { ReviewClientesRowComponent } from './components/review-clientes-row/review-clientes-row.component';
import { ReviewClientesActionComponent } from './components/review-clientes-action/review-clientes-action.component';
import { ReviewClientesFooterComponent } from './components/review-clientes-footer/review-clientes-footer.component';
import { AddReviewClientesModalComponent } from './components/add-review-clientes-modal/add-review-clientes-modal.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-review-clientes',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    ReviewClientesHeaderComponent,
    ReviewClientesRowComponent,
    ReviewClientesActionComponent,
    ReviewClientesFooterComponent,
    AddReviewClientesModalComponent,
    ModalComponent
  ],
  templateUrl: './review-clientes.component.html',
  styleUrl: './review-clientes.component.scss'
})
export class ReviewClientesComponent implements OnInit {
  reviews = signal<ReviewCliente[]>([]);
  isModalOpen = false;
  selectedReview: ReviewCliente | null = null;
  isLoading = false;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;
  currentPage = 1;
  pageSize = 10;
  totalReviews = 0;
  searchTerm = '';
  selectedProjectType = 'Todas';
  selectedRating = 'Todas';

  projectTypes = ['Todas', 'Residencial', 'Comercial', 'Corporativo', 'Industrial'];
  ratings = ['Todas', '5 estrellas', '4 estrellas', '3 estrellas', '2 estrellas', '1 estrella'];

  constructor(private reviewClientesService: ReviewClientesService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewClientesService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.totalReviews = reviews.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoading = false;
      }
    });
  }

  pagedReviews = computed(() => {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredReviews().slice(startIndex, endIndex);
  });

  filteredReviews = computed(() => {
    const search = this.searchTerm.toLowerCase();
    const projectType = this.selectedProjectType;
    const rating = this.selectedRating;
  
    return this.reviews().filter((review) => {
      const matchesSearch = 
        review.clientName.toLowerCase().includes(search) ||
        review.project.toLowerCase().includes(search) ||
        review.projectType.toLowerCase().includes(search) ||
        review.review.toLowerCase().includes(search);
      
      const matchesProjectType = projectType === 'Todas' || this.getProjectType(review.project) === projectType;
      const matchesRating = rating === 'Todas' || this.getRatingFromString(rating) === review.rating;
      
      return matchesSearch && matchesProjectType && matchesRating;
    });
  });

  selectedReviews = signal<ReviewCliente[]>([]);

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

  getRatingFromString(ratingString: string): number {
    return parseInt(ratingString.split(' ')[0]);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  openModal(): void {
    this.selectedReview = null;
    this.isModalOpen = true;
  }

  openEditModal(review: ReviewCliente): void {
    this.selectedReview = review;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedReview = null;
  }

  handleFormSubmit(reviewData: CreateReviewRequest): void {
    if (this.selectedReview) {
      // Update existing review
      this.reviewClientesService.updateReview(this.selectedReview.id, reviewData).subscribe({
        next: () => {
          toast.success('Reseña actualizada exitosamente!');
          this.loadReviews();
          this.closeModal();
        },
        error: (error) => this.handleRequestError(error)
      });
    } else {
      // Create new review
      this.reviewClientesService.createReview(reviewData).subscribe({
        next: () => {
          toast.success('Reseña creada exitosamente!');
          this.loadReviews();
          this.closeModal();
        },
        error: (error) => this.handleRequestError(error)
      });
    }
  }

  deleteReview(id: number): void {
    this.reviewClientesService.deleteReview(id).subscribe({
      next: () => {
        toast.success('Reseña eliminada exitosamente!');
        this.loadReviews();
      },
      error: (error) => this.handleRequestError(error)
    });
  }

  toggleReviewSelection(review: ReviewCliente): void {
    const selected = this.selectedReviews();
    const index = selected.findIndex(r => r.id === review.id);
    
    if (index > -1) {
      this.selectedReviews.set(selected.filter(r => r.id !== review.id));
    } else {
      this.selectedReviews.set([...selected, review]);
    }
  }

  toggleReviews(checked: boolean): void {
    if (checked) {
      this.selectedReviews.set([...this.filteredReviews()]);
    } else {
      this.selectedReviews.set([]);
    }
  }

  isDeleteButtonEnabled(): boolean {
    return this.selectedReviews().length > 0;
  }

  deleteSelected(): void {
    if (confirm(`¿Estás seguro de que quieres eliminar ${this.selectedReviews().length} reseñas?`)) {
      const deletePromises = this.selectedReviews().map(review => 
        this.reviewClientesService.deleteReview(review.id).toPromise()
      );
      
      Promise.all(deletePromises).then(() => {
        toast.success(`${this.selectedReviews().length} reseñas eliminadas exitosamente!`);
        this.selectedReviews.set([]);
        this.loadReviews();
      }).catch(error => {
        this.handleRequestError(error);
      });
    }
  }

  openExportConfirmation(type: 'pdf' | 'csv'): void {
    this.isExporting = type;
    this.isModalOpenExport = true;
  }

  handleExportConfirmation(type: 'pdf' | 'csv'): void {
    this.isModalOpenExport = false;
    if (type === 'pdf') {
      this.exportToPDF();
    } else if (type === 'csv') {
      this.exportToCSV();
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const reviews = this.filteredReviews();
    
    doc.text('Review Clientes - VZOR CMS', 14, 22);
    
    autoTable(doc, {
      head: [['Cliente', 'Proyecto', 'Calificación', 'Tipo Proyecto', 'Fecha de Creación']],
      body: reviews.map(review => [
        review.clientName,
        review.project,
        `${review.rating} ⭐`,
        review.projectType,
        new Date(review.createdAt).toLocaleDateString('es-ES')
      ]),
      startY: 30,
    });
    
    doc.save('review-clientes.pdf');
    toast.success('PDF exportado exitosamente!');
  }

  exportToCSV(): void {
    const reviews = this.filteredReviews();
    const csvContent = [
      ['Cliente', 'Proyecto', 'Calificación', 'Tipo Proyecto', 'Fecha de Creación'],
      ...reviews.map(review => [
        review.clientName,
        review.project,
        review.rating.toString(),
        review.projectType,
        new Date(review.createdAt).toLocaleDateString('es-ES')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'review-clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exportado exitosamente!');
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  onProjectTypeChange(projectType: string): void {
    this.selectedProjectType = projectType;
  }

  onRatingChange(rating: string): void {
    this.selectedRating = rating;
  }

  private handleRequestError(error: any): void {
    const msg = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
    });
    console.error(error);
  }
}