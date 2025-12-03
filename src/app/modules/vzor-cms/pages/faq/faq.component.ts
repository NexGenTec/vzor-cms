import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { FAQService } from '../../services/faq.service';
import { FAQFilterService } from '../../services/faq-filter.service';
import { FAQ } from '../../models/faq.model';
import { FAQHeaderComponent } from './components/faq-header/faq-header.component';
import { FAQRowComponent } from './components/faq-row/faq-row.component';
import { FAQActionComponent } from './components/faq-action/faq-action.component';
import { FAQFooterComponent } from './components/faq-footer/faq-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        FAQHeaderComponent,
        FAQRowComponent,
        FAQActionComponent,
        FAQFooterComponent,
        ModalComponent
    ],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FAQComponent implements OnInit {
    faqs = signal<FAQ[]>([]);
    isLoading = false;
    isModalOpenExport = false;
    isExporting: 'pdf' | 'csv' | null = null;
    currentPage = 1;
    pageSize = 10;
    totalFAQs = 0;

    constructor(
        private faqService: FAQService,
        private filterService: FAQFilterService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadFAQs();
    }

    loadFAQs(): void {
        this.isLoading = true;
        this.faqService.getFAQs().subscribe({
            next: (faqs) => {
                this.faqs.set(faqs);
                this.totalFAQs = faqs.length;
                this.isLoading = false;
            },
            error: (error) => {
                this.handleRequestError(error);
                this.isLoading = false;
            }
        });
    }

    pagedFAQs = computed(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredFAQs().slice(startIndex, endIndex);
    });

    filteredFAQs = computed(() => {
        const search = this.filterService.searchField().toLowerCase();
        const category = this.filterService.categoryField();
        const status = this.filterService.statusField();

        return this.faqs().filter((faq) => {
            const matchesSearch =
                faq.question.toLowerCase().includes(search) ||
                faq.answer.toLowerCase().includes(search);

            const matchesCategory = category === 'Todas' || faq.category === category;
            const matchesStatus = status === 'Todas' ||
                (status === 'Publicado' && faq.isPublished) ||
                (status === 'Borrador' && !faq.isPublished);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    });

    selectedFAQs = signal<FAQ[]>([]);

    changePage(page: number): void {
        this.currentPage = page;
    }

    changePageSize(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
    }

    openModal(): void {
        this.router.navigate(['/layout/vzor-cms/faq/new']);
    }

    openEditModal(faq: FAQ): void {
        this.router.navigate(['/layout/vzor-cms/faq/edit', faq.id]);
    }

    viewFaq(faq: FAQ): void {
        this.router.navigate(['/layout/vzor-cms/faq', faq.id]);
    }

    deleteFAQ(id: string): void {
        this.faqService.deleteFAQ(id).subscribe({
            next: () => {
                toast.success('FAQ eliminada exitosamente!');
                this.loadFAQs();
            },
            error: (error) => this.handleRequestError(error)
        });
    }

    toggleFAQs(checked: boolean): void {
        if (checked) {
            this.selectedFAQs.set([...this.filteredFAQs()]);
        } else {
            this.selectedFAQs.set([]);
        }
    }

    onSearchChange(searchTerm: string): void {
        this.filterService.searchField.set(searchTerm);
    }

    onCategoryChange(category: string): void {
        this.filterService.categoryField.set(category);
    }

    onStatusChange(status: string): void {
        this.filterService.statusField.set(status);
    }

    private handleRequestError(error: any): void {
        const msg = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
        toast.error(msg, {
            position: 'top-right',
            description: error.message,
        });
        console.error(error);
    }
}
