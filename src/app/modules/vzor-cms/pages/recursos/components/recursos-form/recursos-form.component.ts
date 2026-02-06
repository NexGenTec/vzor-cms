import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { RecursosService } from '../../../../services/recursos.service';
import { StorageService } from '../../../../services/storage.service';
import { Recurso, CreateRecursoRequest } from '../../../../models/recursos.model';

@Component({
    selector: 'app-recursos-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './recursos-form.component.html',
    styleUrl: './recursos-form.component.scss'
})
export class RecursosFormComponent implements OnInit {
    recursoForm!: FormGroup;
    isEditMode = false;
    recursoId: number | null = null;
    isLoading = false;
    selectedFile: File | null = null;
    filePreview: string | null = null;
    isUploadingFile = false;

    categories = ['Documentación', 'Formación', 'Marketing', 'Técnico'];
    types = ['Documento', 'Imagen', 'Video'];

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private recursosService = inject(RecursosService);
    private storageService = inject(StorageService);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    private initializeForm(): void {
        this.recursoForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            type: ['', Validators.required],
            category: ['', Validators.required],
            fileUrl: ['']
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.recursoId = Number(id);
            this.loadRecurso();
        }
    }

    private loadRecurso(): void {
        if (this.recursoId) {
            this.isLoading = true;
            this.recursosService.getRecurso(this.recursoId).subscribe({
                next: (recurso: Recurso | undefined) => {
                    if (recurso) {
                        this.populateForm(recurso);
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    toast.error('Error al cargar el recurso');
                    console.error(error);
                    this.isLoading = false;
                }
            });
        }
    }

    private populateForm(recurso: Recurso): void {
        this.recursoForm.patchValue({
            title: recurso.title,
            description: recurso.description,
            type: recurso.type,
            category: recurso.category
        });

        // TODO: If the recurso has a fileUrl, we should display it
        // For now, we're just storing it in the form
        if (recurso.category) {
            this.filePreview = `Archivo existente: ${recurso.title}`;
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Validate file type based on selected type
            const selectedType = this.recursoForm.get('type')?.value;
            if (!this.validateFileType(file, selectedType)) {
                toast.error(`Por favor, selecciona un archivo de tipo ${selectedType}`);
                return;
            }

            // Validate size (10MB for videos, 5MB for others)
            const maxSize = selectedType === 'Video' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error(`El archivo debe ser menor a ${selectedType === 'Video' ? '10MB' : '5MB'}`);
                return;
            }

            this.selectedFile = file;
            this.filePreview = file.name;
        }
    }

    private validateFileType(file: File, type: string): boolean {
        if (!type) return true; // If no type selected yet, allow file

        if (type === 'Documento') {
            return file.type.includes('pdf') || file.type.includes('document') ||
                file.type.includes('msword') || file.type.includes('text');
        } else if (type === 'Imagen') {
            return file.type.startsWith('image/');
        } else if (type === 'Video') {
            return file.type.startsWith('video/');
        }
        return false;
    }

    removeFile(): void {
        this.selectedFile = null;
        this.filePreview = null;
    }

    async uploadFile(): Promise<string | null> {
        if (!this.selectedFile) return null;

        this.isUploadingFile = true;
        const fileName = this.storageService.generateFileName(this.selectedFile.name);

        try {
            const recursoId = this.recursoId?.toString() || this.generateTempId();
            const type = this.recursoForm.get('type')?.value.toLowerCase();
            const path = `recursos/${type}/${recursoId}/${fileName}`;

            const fileUrl = await this.storageService.uploadImage(this.selectedFile, path).toPromise();
            this.isUploadingFile = false;
            return fileUrl || null;
        } catch (error) {
            this.isUploadingFile = false;
            toast.error('Error al subir el archivo');
            console.error(error);
            return null;
        }
    }

    private generateTempId(): string {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async onSubmit(): Promise<void> {
        if (this.recursoForm.valid) {
            this.isLoading = true;

            try {
                let fileUrl: string | undefined = undefined;

                // If there's a new file selected, upload it
                if (this.selectedFile) {
                    const uploadedUrl = await this.uploadFile();
                    if (!uploadedUrl) {
                        this.isLoading = false;
                        return;
                    }
                    fileUrl = uploadedUrl;
                }

                const formData: CreateRecursoRequest = {
                    title: this.recursoForm.value.title,
                    description: this.recursoForm.value.description,
                    type: this.recursoForm.value.type,
                    category: this.recursoForm.value.category
                };

                if (this.isEditMode && this.recursoId) {
                    // Update existing recurso
                    this.recursosService.updateRecurso(this.recursoId, formData).subscribe({
                        next: () => {
                            toast.success('Recurso actualizado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/recursos']);
                        },
                        error: (error: any) => {
                            this.handleRequestError(error);
                            this.isLoading = false;
                        }
                    });
                } else {
                    // Create new recurso
                    this.recursosService.createRecurso(formData).subscribe({
                        next: () => {
                            toast.success('Recurso creado exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/recursos']);
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
            this.recursoForm.markAllAsTouched();
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/recursos']);
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
