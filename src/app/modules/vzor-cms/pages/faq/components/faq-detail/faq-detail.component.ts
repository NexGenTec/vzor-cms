import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FAQService } from '../../../../services/faq.service';
import { FAQ } from '../../../../models/faq.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-faq-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq-detail.component.html',
    styleUrl: './faq-detail.component.scss'
})
export class FaqDetailComponent implements OnInit {
    faq: FAQ | undefined;
    isLoading = true;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private faqService = inject(FAQService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadFaq(id);
        } else {
            this.router.navigate(['/layout/vzor-cms/faq']);
        }
    }

    private loadFaq(id: string): void {
        this.faqService.getFAQById(id).subscribe({
            next: (faq: FAQ | undefined) => {
                this.faq = faq;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error(error);
                toast.error('Error al cargar el FAQ');
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/faq']);
    }

    editFaq(): void {
        if (this.faq) {
            this.router.navigate(['/layout/vzor-cms/faq/edit', this.faq.id]);
        }
    }

    getFormattedDate(date: any): Date | null {
        if (!date) return null;
        try {
            if (date instanceof Date) return date;
            if (date && typeof date === 'object' && date.toDate) return date.toDate();
            if (date && typeof date === 'object' && date.seconds) return new Date(date.seconds * 1000);
            if (typeof date === 'string' || typeof date === 'number') return new Date(date);
            return null;
        } catch (error) {
            return null;
        }
    }
}
