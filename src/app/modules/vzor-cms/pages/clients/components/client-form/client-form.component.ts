import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { ClientService } from '../../../../services/client.service';
import { StorageService } from '../../../../services/storage.service';
import { Client, CreateClientRequest } from '../../../../models/client.model';

@Component({
    selector: 'app-client-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './client-form.component.html',
    styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
    clientForm!: FormGroup;
    isEditMode = false;
    clientId: string | null = null;
    isLoading = false;
    selectedLogo: File | null = null;
    logoPreview: string | null = null;
    isUploadingLogo = false;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private clientService = inject(ClientService);
    private storageService = inject(StorageService);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    private initializeForm(): void {
        this.clientForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            website: ['', Validators.required],
            sector: ['', Validators.required],
            logoUrl: [''],
            order: [0, Validators.required],
            isPublished: [true]
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.clientId = id;
            this.loadClient();
        }
    }

    private loadClient(): void {
        if (this.clientId) {
            this.isLoading = true;
            this.clientService.getClientById(this.clientId).subscribe({
                next: (client: Client | undefined) => {
                    if (client) {
                        this.populateForm(client);
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    toast.error('Error al cargar el cliente');
                    console.error(error);
                    this.isLoading = false;
                }
            });
        }
    }

    private populateForm(client: Client): void {
        this.clientForm.patchValue({
            name: client.name,
            description: client.description,
            website: client.website,
            sector: client.sector,
            logoUrl: client.logoUrl,
            order: client.order,
            isPublished: client.isPublished
        });

        if (client.logoUrl) {
            this.logoPreview = client.logoUrl;
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
        this.clientForm.patchValue({ logoUrl: '' });
    }

    async uploadLogo(): Promise<string | null> {
        if (!this.selectedLogo) return null;

        this.isUploadingLogo = true;
        const fileName = this.storageService.generateFileName(this.selectedLogo.name);

        try {
            const clientIdStr = this.clientId || this.generateTempId();
            const path = `clients/logos/${clientIdStr}/${fileName}`;

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
        if (this.clientForm.valid) {
            this.isLoading = true;

            try {
                let logoUrl: string | undefined = this.clientForm.value.logoUrl;

                if (this.selectedLogo) {
                    const uploadedUrl = await this.uploadLogo();
                    if (!uploadedUrl) {
                        this.isLoading = false;
                        return;
                    }
                    logoUrl = uploadedUrl;
                }

                const formData: CreateClientRequest = {
                    ...this.clientForm.value,
                    logoUrl: logoUrl || ''
                };

                if (this.isEditMode && this.clientId) {
                    this.clientService.updateClient(this.clientId, formData).subscribe({
                        next: () => {
                            toast.success('Cliente actualizado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/clients']);
                        },
                        error: (error: any) => {
                            this.handleRequestError(error);
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.clientService.createClient(formData).subscribe({
                        next: () => {
                            toast.success('Cliente creado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/clients']);
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
            this.clientForm.markAllAsTouched();
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/clients']);
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
