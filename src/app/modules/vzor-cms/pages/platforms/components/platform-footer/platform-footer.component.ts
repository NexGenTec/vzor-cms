import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-platform-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './platform-footer.component.html',
    styleUrl: './platform-footer.component.scss'
})
export class PlatformFooterComponent {
    @Input() currentPage = 1;
    @Input() totalPlatforms = 0;
    @Input() pageSize = 10;
    @Output() pageChanged = new EventEmitter<number>();
    @Output() pageSizeChanged = new EventEmitter<number>();

    totalPages = computed(() => Math.ceil(this.totalPlatforms / this.pageSize));

    onPageChange(page: number) {
        this.pageChanged.emit(page);
    }

    onPageSizeChange(event: any) {
        this.pageSizeChanged.emit(Number(event.target.value));
    }
}
