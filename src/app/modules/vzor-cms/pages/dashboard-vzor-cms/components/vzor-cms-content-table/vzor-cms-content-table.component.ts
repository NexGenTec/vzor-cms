import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BlogPost } from '../../../../models/blog.model';
import { Recurso } from '../../../../models/recursos.model';
import { ReviewCliente } from '../../../../models/review-clientes.model';

interface ContentItem {
  id: number;
  title: string;
  type: 'blog' | 'recurso' | 'review';
  category: string;
  createdAt: Date;
  status: string;
}

@Component({
  selector: 'app-vzor-cms-content-table',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularSvgIconModule],
  templateUrl: './vzor-cms-content-table.component.html',
  styleUrl: './vzor-cms-content-table.component.scss'
})
export class VzorCmsContentTableComponent implements OnInit, OnChanges {
  @Input() blogPosts: BlogPost[] = [];
  @Input() recursos: Recurso[] = [];
  @Input() reviews: ReviewCliente[] = [];

  contentItems: ContentItem[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadContentItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blogPosts'] || changes['recursos'] || changes['reviews']) {
      this.loadContentItems();
    }
  }

  loadContentItems(): void {
    const items: ContentItem[] = [];

    // Agregar posts del blog
    this.blogPosts.forEach(post => {
      items.push({
        id: post.id,
        title: post.title,
        type: 'blog',
        category: post.category,
        createdAt: post.createdAt,
        status: 'Publicado'
      });
    });

    // Agregar recursos
    this.recursos.forEach(recurso => {
      items.push({
        id: recurso.id,
        title: recurso.title,
        type: 'recurso',
        category: recurso.category,
        createdAt: recurso.createdAt,
        status: 'Disponible'
      });
    });

    // Agregar reseñas
    this.reviews.forEach(review => {
      items.push({
        id: review.id,
        title: `${review.clientName} - ${review.project}`,
        type: 'review',
        category: 'Reseña',
        createdAt: review.createdAt,
        status: 'Activa'
      });
    });

    // Ordenar por fecha de creación (más recientes primero)
    this.contentItems = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'blog': return 'assets/icons/heroicons/outline/document-text.svg';
      case 'recurso': return 'assets/icons/heroicons/outline/arrow-down-tray.svg';
      case 'review': return 'assets/icons/heroicons/outline/star.svg';
      default: return 'assets/icons/heroicons/outline/document.svg';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'blog': return 'text-blue-600 bg-blue-100';
      case 'recurso': return 'text-green-600 bg-green-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getRoute(type: string): string {
    switch (type) {
      case 'blog': return '/layout/vzor-cms/blog';
      case 'recurso': return '/layout/vzor-cms/recursos';
      case 'review': return '/layout/vzor-cms/review-clientes';
      default: return '/layout/vzor-cms/dashboard';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
