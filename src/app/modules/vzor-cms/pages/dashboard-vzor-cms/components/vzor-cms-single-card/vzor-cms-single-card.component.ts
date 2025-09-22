import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogPost } from '../../../../models/blog.model';
import { Recurso } from '../../../../models/recursos.model';

@Component({
  selector: 'app-vzor-cms-single-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vzor-cms-single-card.component.html',
  styleUrl: './vzor-cms-single-card.component.scss'
})
export class VzorCmsSingleCardComponent {
  @Input() content!: BlogPost | Recurso;
  @Input() type!: 'post' | 'recurso';

  getImageUrl(): string {
    if (this.type === 'post') {
      return 'assets/avatars/avt-02.jpg'; // Imagen por defecto para posts
    } else {
      return 'assets/avatars/avt-02.jpg'; // Imagen por defecto para recursos
    }
  }

  getTitle(): string {
    if (this.type === 'post') {
      return (this.content as BlogPost).title;
    } else {
      return (this.content as Recurso).title;
    }
  }

  getDescription(): string {
    if (this.type === 'post') {
      return (this.content as BlogPost).excerpt;
    } else {
      return (this.content as Recurso).description;
    }
  }

  getCategory(): string {
    if (this.type === 'post') {
      return (this.content as BlogPost).category;
    } else {
      return (this.content as Recurso).category;
    }
  }

  getRoute(): string {
    if (this.type === 'post') {
      return '/layout/vzor-cms/blog';
    } else {
      return '/layout/vzor-cms/recursos';
    }
  }
}
