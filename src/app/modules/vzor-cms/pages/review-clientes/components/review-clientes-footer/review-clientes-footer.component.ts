import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-clientes-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-clientes-footer.component.html',
  styleUrl: './review-clientes-footer.component.scss'
})
export class ReviewClientesFooterComponent {
  @Input() currentPage = 1;
  @Input() totalReviews = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalReviews / this.pageSize));

  onPageChange(page: number) {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any) {
    this.pageSizeChanged.emit(Number(event.target.value));
  }
}