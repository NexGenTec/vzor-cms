import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-faq-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq-footer.component.html',
    styleUrl: './faq-footer.component.scss'
})
export class FAQFooterComponent {
    @Input() currentPage = 1;
    @Input() totalFAQs = 0;
    @Input() pageSize = 10;
    @Output() pageChanged = new EventEmitter<number>();
    @Output() pageSizeChanged = new EventEmitter<number>();

    totalPages = computed(() => Math.ceil(this.totalFAQs / this.pageSize));

    onPageChange(page: number) {
        this.pageChanged.emit(page);
    }

    onPageSizeChange(event: any) {
        this.pageSizeChanged.emit(Number(event.target.value));
    }
}
