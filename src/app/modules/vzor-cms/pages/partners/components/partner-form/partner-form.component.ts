import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { PartnerService } from '../../../../services/partner.service';
import { StorageService } from '../../../../services/storage.service';
import { Partner, CreatePartnerRequest } from '../../../../models/partner.model';

@Component({
    selector: 'app-partner-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './partner-form.component.html',
    styleUrl: './partner-form.component.scss'
})
export class PartnerFormComponent implements OnInit {
    partnerForm!: FormGroup;
    isEditMode = false;
    partnerId: string | null = null;
    isLoading = false;
    selectedLogo: File | null = null;
    logoPreview: string | null = null;
    isUploadingLogo = false;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private partnerService = inject(PartnerService);
    private storageService = inject(StorageService);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    private initializeForm(): void {
        this.partnerForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            website: ['', Validators.required],
            logoUrl: [''],
            order: [0, Validators.required],
            isVisible: [true]
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.partnerId = id;
            this.loadPartner();
        }
    }

    private loadPartner(): void {
        if (this.partnerId) {
            this.isLoading = true;
            this.partnerService.getPartnerById(this.partnerId).subscribe({
                next: (partner: Partner | undefined) => {
                    if (partner) {
                        this.populateForm(partner);
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    toast.error('Error al cargar el socio');
                    console.error(error);
                    this.isLoading = false;
                }
            });
        }
    }

    private populateForm(partner: Partner): void {
        this.partnerForm.patchValue({
            name: partner.name,
            description: partner.description,
            website: partner.website,
            logoUrl: partner.logoUrl,
            order: partner.order,
            isVisible: partner.isVisible
        });

        if (partner.logoUrl) {
            this.logoPreview = partner.logoUrl;
        }
    }

    onLogoSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor, selecciona una imagen válida');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('La imagen debe ser menor a 2MB');
                return;
            }

            this.selectedLogo = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    removeLogo(): void {
        this.selectedLogo = null;
        this.logoPreview = null;
        this.partnerForm.patchValue({ logoUrl: '' });
    }

    async uploadLogo(): Promise<string | null> {
        if (!this.selectedLogo) return null;

        this.isUploadingLogo = true;
        const fileName = this.storageService.generateFileName(this.selectedLogo.name);

        try {
            const partnerIdStr = this.partnerId || this.generateTempId();
            const path = `partners/logos/${partnerIdStr}/${fileName}`;

            const logoUrl = await this.storageService.uploadImage(this.selectedLogo, path).toPromise();
            this.isUploadingLogo = false;
            return logoUrl || null;
        } catch (error) {
            this.isUploadingLogo = false;
            toast.error('Error al subir el logo');
            console.error(error);
            return null;
        }
    }

    private generateTempId(): string {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async onSubmit(): Promise<void> {
        if (this.partnerForm.valid) {
            this.isLoading = true;

            try {
                let logoUrl: string | undefined = this.partnerForm.value.logoUrl;

                if (this.selectedLogo) {
                    const uploadedUrl = await this.uploadLogo();
                    if (!uploadedUrl) {
                        this.isLoading = false;
                        return;
                    }
                    logoUrl = uploadedUrl;
                }

                const formData: CreatePartnerRequest = {
                    ...this.partnerForm.value,
                    logoUrl: logoUrl || ''
                };

                if (this.isEditMode && this.partnerId) {
                    this.partnerService.updatePartner(this.partnerId, formData).subscribe({
                        next: () => {
                            toast.success('Socio actualizado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/partners']);
                        },
                        error: (error: any) => {
                            this.handleRequestError(error);
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.partnerService.createPartner(formData).subscribe({
                        next: () => {
                            toast.success('Socio creado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/partners']);
                        },
                        error: (error: any) => {
                            this.handleRequestError(error);
                            this.isLoading = false;
                        }
                    });
                }
            } catch (error) {
                this.isLoading = false;
                this.handleRequestError(error);
            }
        } else {
            this.partnerForm.markAllAsTouched();
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/partners']);
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
