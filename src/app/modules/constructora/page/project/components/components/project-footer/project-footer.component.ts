import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-project-footer',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './project-footer.component.html',
  styleUrl: './project-footer.component.scss'
})
export class ProjectFooterComponent {
  @Input() currentPage: number = 1;
  @Input() totalProjects: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalProjects / this.pageSize);
  }

  get totalProjectsDisplay(): number {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalProjects);
    return end - start + 1;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  changePageSize(size: number) {
    this.pageSizeChanged.emit(size);
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

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value);
    this.pageSizeChanged.emit(newSize);
  }
}
