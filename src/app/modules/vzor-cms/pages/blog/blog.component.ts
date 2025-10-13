import { Component, computed, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BlogService } from '../../services/blog.service';
import { BlogFilterService } from '../../services/blog-filter.service';
import { BlogPost, CreateBlogPostRequest } from '../../models/blog.model';
import { BlogHeaderComponent } from './components/blog-header/blog-header.component';
import { BlogRowComponent } from './components/blog-row/blog-row.component';
import { BlogActionComponent } from './components/blog-action/blog-action.component';
import { BlogFooterComponent } from './components/blog-footer/blog-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    BlogHeaderComponent,
    BlogRowComponent,
    BlogActionComponent,
    BlogFooterComponent,
    ModalComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  blogPosts = signal<BlogPost[]>([]);
  isLoading = false;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPosts = 0;
  searchTerm = '';
  selectedCategory = 'Todas';

  categories = ['Todas', 'Sostenibilidad', 'Gestión', 'Tecnología', 'Seguridad', 'Noticias'];

  constructor(
    private blogService: BlogService,
    private filterService: BlogFilterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.isLoading = true;
    this.blogService.getBlogPosts().subscribe({
      next: (posts) => {
        this.blogPosts.set(posts);
        this.totalPosts = posts.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoading = false;
      }
    });
  }

  pagedBlogPosts = computed(() => {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredBlogPosts().slice(startIndex, endIndex);
  });

  filteredBlogPosts = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const category = this.filterService.categoryField();
    const status = this.filterService.statusField();
  
    return this.blogPosts().filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        (post.author && post.author.toLowerCase().includes(search));
      
      const matchesCategory = category === 'Todas' || post.category === category;
      const matchesStatus = status === 'Todas' || (status === 'Publicado' && post.status === 'published') || (status === 'Borrador' && post.status === 'draft');
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  selectedPosts = signal<BlogPost[]>([]);

  changePage(page: number): void {
    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  openModal(): void {
    this.router.navigate(['/layout/vzor-cms/blog/new']);
  }

  openEditModal(post: BlogPost): void {
    this.router.navigate(['/layout/vzor-cms/blog/edit', post.id]);
  }

  deleteBlogPost(id: string): void {
    this.blogService.deleteBlogPost(id).subscribe({
      next: () => {
        toast.success('Post eliminado exitosamente!');
        this.loadBlogPosts();
      },
      error: (error) => this.handleRequestError(error)
    });
  }

  togglePostSelection(post: BlogPost): void {
    const selected = this.selectedPosts();
    const index = selected.findIndex(p => p.id === post.id);
    
    if (index > -1) {
      this.selectedPosts.set(selected.filter(p => p.id !== post.id));
    } else {
      this.selectedPosts.set([...selected, post]);
    }
  }

  togglePosts(checked: boolean): void {
    if (checked) {
      this.selectedPosts.set([...this.filteredBlogPosts()]);
    } else {
      this.selectedPosts.set([]);
    }
  }

  isDeleteButtonEnabled(): boolean {
    return this.selectedPosts().length > 0;
  }

  deleteSelected(): void {
    if (confirm(`¿Estás seguro de que quieres eliminar ${this.selectedPosts().length} posts?`)) {
      const deletePromises = this.selectedPosts().map(post => 
        this.blogService.deleteBlogPost(post.id).toPromise()
      );
      
      Promise.all(deletePromises).then(() => {
        toast.success(`${this.selectedPosts().length} posts eliminados exitosamente!`);
        this.selectedPosts.set([]);
        this.loadBlogPosts();
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
    const posts = this.filteredBlogPosts();
    
    doc.text('Blog Posts - VZOR CMS', 14, 22);
    
    autoTable(doc, {
      head: [['Título', 'Autor', 'Categoría', 'Fecha']],
      body: posts.map(post => [
        post.title,
        post.author || 'Sin autor',
        post.category,
        post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Sin fecha'
      ]),
      startY: 30,
    });
    
    doc.save('blog-posts.pdf');
    toast.success('PDF exportado exitosamente!');
  }

  exportToCSV(): void {
    const posts = this.filteredBlogPosts();
    const csvContent = [
      ['Título', 'Autor', 'Categoría', 'Fecha'],
      ...posts.map(post => [
        post.title,
        post.author || 'Sin autor',
        post.category,
        post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Sin fecha'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'blog-posts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exportado exitosamente!');
  }

  onSearchChange(searchTerm: string): void {
    this.filterService.searchField.set(searchTerm);
  }

  onCategoryChange(category: string): void {
    this.filterService.categoryField.set(category);
  }

  onStatusChange(status: string): void {
    this.filterService.statusField.set(status);
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