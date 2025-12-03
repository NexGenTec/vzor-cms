import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-footer.component.html',
    styleUrl: './client-footer.component.scss'
})
export class ClientFooterComponent {
    @Input() currentPage = 1;
    @Input() totalClients = 0;
    @Input() pageSize = 10;
    @Output() pageChanged = new EventEmitter<number>();
    @Output() pageSizeChanged = new EventEmitter<number>();

    totalPages = computed(() => Math.ceil(this.totalClients / this.pageSize));

    onPageChange(page: number) {
        this.pageChanged.emit(page);
    }

    onPageSizeChange(event: any) {
        this.pageSizeChanged.emit(Number(event.target.value));
    }
}
