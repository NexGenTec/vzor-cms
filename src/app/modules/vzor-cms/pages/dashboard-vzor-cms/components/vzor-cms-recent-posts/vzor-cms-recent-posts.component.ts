import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BlogPost } from '../../../../models/blog.model';

@Component({
  selector: 'app-vzor-cms-recent-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularSvgIconModule],
  templateUrl: './vzor-cms-recent-posts.component.html',
  styleUrl: './vzor-cms-recent-posts.component.scss'
})
export class VzorCmsRecentPostsComponent {
  @Input() posts: BlogPost[] = [];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  }
}
