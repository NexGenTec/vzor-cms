import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-footer.component.html',
  styleUrl: './blog-footer.component.scss'
})
export class BlogFooterComponent {
  @Input() currentPage = 1;
  @Input() totalPosts = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalPosts / this.pageSize));

  onPageChange(page: number) {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any) {
    this.pageSizeChanged.emit(Number(event.target.value));
  }
}