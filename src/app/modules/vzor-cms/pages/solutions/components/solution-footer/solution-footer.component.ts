import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-footer.component.html',
  styleUrl: './solution-footer.component.scss'
})
export class SolutionFooterComponent {
  @Input() currentPage = 1;
  @Input() totalSolutions = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalSolutions / this.pageSize));

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any): void {
    this.pageSizeChanged.emit(Number(event.target.value));
  }
}


