import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-team-footer',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule],
  templateUrl: './team-footer.component.html',
  styleUrl: './team-footer.component.scss'
})
export class TeamFooterComponent {
  @Input() currentPage: number = 1;
  @Input() totalTeams: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalTeams / this.pageSize);
  }

  get totalTeamsDisplay(): number {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalTeams);
    return end - start + 1;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  onPageSizeChange(event: any) {
    const newSize = parseInt(event.target.value);
    this.pageSizeChanged.emit(newSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.pageChanged.emit(page);
  }
} 