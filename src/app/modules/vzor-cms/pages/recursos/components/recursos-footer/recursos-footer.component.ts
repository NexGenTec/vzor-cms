import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recursos-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recursos-footer.component.html',
  styleUrl: './recursos-footer.component.scss'
})
export class RecursosFooterComponent {
  @Input() currentPage = 1;
  @Input() totalRecursos = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalRecursos / this.pageSize));

  onPageChange(page: number) {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any) {
    this.pageSizeChanged.emit(Number(event.target.value));
  }
}