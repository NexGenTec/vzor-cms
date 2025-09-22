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
  @Output() deletePost = new EventEmitter<number>();

  constructor(private router: Router) {}

  onEdit(): void {
    this.editPost.emit(this.blogPost);
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      this.deletePost.emit(this.blogPost.id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewPost(id: number): void {
    this.router.navigate(['/layout/vzor-cms/blog', id.toString()]);
    toast.info(`Viendo post: ${this.blogPost.title}`);
  }
}