import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BlogPost } from '../../../../models/blog.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: '[app-blog-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule, ConfirmModalComponent],
  templateUrl: './blog-row.component.html',
  styleUrl: './blog-row.component.scss'
})
export class BlogRowComponent {
  @Input() blogPost!: BlogPost;
  @Input() onEditPost!: (post: BlogPost) => void;
  @Output() editPost = new EventEmitter<BlogPost>();
  @Output() deletePost = new EventEmitter<string>();

  showDeleteModal = false;

  constructor(private router: Router) {}

  onEdit(): void {
    this.editPost.emit(this.blogPost);
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.deletePost.emit(this.blogPost.id);
    this.showDeleteModal = false;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
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