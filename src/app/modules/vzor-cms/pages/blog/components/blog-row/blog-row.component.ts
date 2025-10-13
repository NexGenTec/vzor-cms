import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BlogPost } from '../../../../models/blog.model';

@Component({
  selector: '[app-blog-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './blog-row.component.html',
  styleUrl: './blog-row.component.scss'
})
export class BlogRowComponent {
  @Input() blogPost!: BlogPost;
  @Input() onEditPost!: (post: BlogPost) => void;
  @Output() editPost = new EventEmitter<BlogPost>();
  @Output() deletePost = new EventEmitter<string>();

  constructor(private router: Router) {}

  onEdit(): void {
    this.editPost.emit(this.blogPost);
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      this.deletePost.emit(this.blogPost.id);
    }
  }

  viewPost(id: string): void {
    this.router.navigate(['/layout/vzor-cms/blog', id]);
    toast.info(`Viendo post: ${this.blogPost.title}`);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/no_productos.png';
  }

  getFormattedDate(date: any): Date | null {
    if (!date) return null;
    
    try {
      if (date instanceof Date) {
        return date;
      } else if (date && typeof date === 'object' && date.toDate) {
        // Firestore Timestamp
        return date.toDate();
      } else if (date && typeof date === 'object' && date.seconds) {
        // Firestore Timestamp with seconds
        return new Date(date.seconds * 1000);
      } else if (typeof date === 'string' || typeof date === 'number') {
        return new Date(date);
      }
      return null;
    } catch (error) {
      console.warn('Error converting date:', date, error);
      return null;
    }
  }
}