import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-partner-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './partner-footer.component.html',
    styleUrl: './partner-footer.component.scss'
})
export class PartnerFooterComponent {
    @Input() currentPage = 1;
    @Input() totalPartners = 0;
    @Input() pageSize = 10;
    @Output() pageChanged = new EventEmitter<number>();
    @Output() pageSizeChanged = new EventEmitter<number>();

    totalPages = computed(() => Math.ceil(this.totalPartners / this.pageSize));

    onPageChange(page: number) {
        this.pageChanged.emit(page);
    }

    onPageSizeChange(event: any) {
        this.pageSizeChanged.emit(Number(event.target.value));
    }
}
