import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { FAQService } from '../../../../services/faq.service';
import { FAQ, CreateFAQRequest } from '../../../../models/faq.model';

@Component({
    selector: 'app-faq-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './faq-form.component.html',
    styleUrl: './faq-form.component.scss'
})
export class FAQFormComponent implements OnInit {
    faqForm!: FormGroup;
    isEditMode = false;
    faqId: number | null = null;
    isLoading = false;

    categories = ['General', 'Técnico', 'Productos', 'Servicios', 'Soporte'];

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private faqService = inject(FAQService);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    private initializeForm(): void {
        this.faqForm = this.fb.group({
            question: ['', Validators.required],
            answer: ['', Validators.required],
            category: ['', Validators.required],
            order: [0, Validators.required],
            isPublished: [false]
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.faqId = Number(id);
            this.loadFAQ();
        }
    }

    private loadFAQ(): void {
        if (this.faqId) {
            this.isLoading = true;
            this.faqService.getFAQById(this.faqId).subscribe({
                next: (faq: FAQ | undefined) => {
                    if (faq) {
                        this.faqForm.patchValue(faq);
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    toast.error('Error al cargar el FAQ');
                    console.error(error);
                    this.isLoading = false;
                }
            });
        }
    }

    onSubmit(): void {
        if (this.faqForm.valid) {
            this.isLoading = true;
            const formData: CreateFAQRequest = this.faqForm.value;

            if (this.isEditMode && this.faqId) {
                this.faqService.updateFAQ(this.faqId, formData).subscribe({
                    next: () => {
                        toast.success('FAQ actualizada exitosamente!');
                        this.router.navigate(['/layout/vzor-cms/faq']);
                    },
                    error: (error: any) => {
                        this.handleRequestError(error);
                        this.isLoading = false;
                    }
                });
            } else {
                this.faqService.createFAQ(formData).subscribe({
                    next: () => {
                        toast.success('FAQ creada exitosamente!');
                        this.router.navigate(['/layout/vzor-cms/faq']);
                    },
                    error: (error: any) => {
                        this.handleRequestError(error);
                        this.isLoading = false;
                    }
                });
            }
        } else {
            this.faqForm.markAllAsTouched();
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/faq']);
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
