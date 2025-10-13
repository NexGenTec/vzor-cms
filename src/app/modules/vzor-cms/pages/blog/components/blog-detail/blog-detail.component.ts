import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { BlogService } from '../../../../services/blog.service';
import { BlogPost } from '../../../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  blogPost: BlogPost | undefined;
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private blogService = inject(BlogService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlogPostById(id).subscribe({
        next: (post: BlogPost | undefined) => {
          this.blogPost = post;
        },
        error: (error: any) => {
          toast.error('Error al cargar el post');
          console.error(error);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  get hasSections(): boolean {
    return !!(this.blogPost?.sections && this.blogPost.sections.length > 0);
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
