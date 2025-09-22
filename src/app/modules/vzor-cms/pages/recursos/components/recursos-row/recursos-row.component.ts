import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Recurso } from '../../../../models/recursos.model';

@Component({
  selector: '[app-recursos-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './recursos-row.component.html',
  styleUrl: './recursos-row.component.scss'
})
export class RecursosRowComponent {
  @Input() recurso!: Recurso;
  @Input() onEditRecurso!: (recurso: Recurso) => void;
  @Output() editRecurso = new EventEmitter<Recurso>();
  @Output() deleteRecurso = new EventEmitter<number>();
  @Output() downloadRecurso = new EventEmitter<number>();
  @Output() viewRecurso = new EventEmitter<Recurso>();

  constructor(private router: Router) {}

  onView(): void {
    this.router.navigate(['/layout/vzor-cms/recursos', this.recurso.id.toString()]);
    toast.info(`Viendo recurso: ${this.recurso.title}`);
  }

  onEdit(): void {
    this.editRecurso.emit(this.recurso);
  }

  onDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      this.deleteRecurso.emit(this.recurso.id);
    }
  }

  onDownload(): void {
    this.downloadRecurso.emit(this.recurso.id);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'PDF': '📄',
      'Excel': '📊',
      'Video': '🎥',
      'Software': '💻',
      'Imagen': '🖼️'
    };
    return icons[type] || '📁';
  }
}