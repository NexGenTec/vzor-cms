import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution-tab-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-tab-footer.component.html',
  styleUrl: './solution-tab-footer.component.scss'
})
export class SolutionTabFooterComponent {
  @Input() currentPage = 1;
  @Input() totalSolutionTabs = 0;
  @Input() pageSize = 10;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalSolutionTabs / this.pageSize));

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any): void {
    this.pageSizeChanged.emit(Number(event.target.value));
  }
}


