import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { PlatformService } from '../../../../services/platform.service';
import { StorageService } from '../../../../services/storage.service';
import { Platform, CreatePlatformRequest, Solution } from '../../../../models/platform.model';

@Component({
    selector: 'app-platform-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './platform-form.component.html',
    styleUrl: './platform-form.component.scss'
})
export class PlatformFormComponent implements OnInit {
    platformForm!: FormGroup;
    isEditMode = false;
    platformId: string | null = null;
    isLoading = false;
    selectedIcon: File | null = null;
    iconPreview: string | null = null;
    isUploadingIcon = false;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private platformService = inject(PlatformService);
    private storageService = inject(StorageService);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    private initializeForm(): void {
        this.platformForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            iconUrl: [''],
            order: [0, Validators.required],
            isActive: [true],
            solutions: this.fb.array([])
        });

        // Add one solution by default
        this.addSolution();
    }

    get solutions(): FormArray {
        return this.platformForm.get('solutions') as FormArray;
    }

    getSolutionFormGroup(index: number): FormGroup {
        return this.solutions.at(index) as FormGroup;
    }

    createSolutionFormGroup(): FormGroup {
        return this.fb.group({
            id: [this.generateSolutionId()],
            title: ['', Validators.required],
            description: ['', Validators.required],
            features: this.fb.array([this.fb.control('', Validators.required)]),
            iconUrl: [''],
            order: [this.solutions.length]
        });
    }

    private generateSolutionId(): string {
        return 'sol_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    addSolution(): void {
        this.solutions.push(this.createSolutionFormGroup());
    }

    removeSolution(index: number): void {
        if (this.solutions.length > 1) {
            this.solutions.removeAt(index);
        } else {
            toast.warning('Debe haber al menos una solución');
        }
    }

    getFeatures(solutionIndex: number): FormArray {
        return this.getSolutionFormGroup(solutionIndex).get('features') as FormArray;
    }

    addFeature(solutionIndex: number): void {
        this.getFeatures(solutionIndex).push(this.fb.control('', Validators.required));
    }

    removeFeature(solutionIndex: number, featureIndex: number): void {
        const features = this.getFeatures(solutionIndex);
        if (features.length > 1) {
            features.removeAt(featureIndex);
        }
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.platformId = id;
            this.loadPlatform();
        }
    }

    private loadPlatform(): void {
        if (this.platformId) {
            this.isLoading = true;
            this.platformService.getPlatformById(this.platformId).subscribe({
                next: (platform: Platform | undefined) => {
                    if (platform) {
                        this.populateForm(platform);
                    }
                    this.isLoading = false;
                },
                error: (error: any) => {
                    toast.error('Error al cargar la plataforma');
                    console.error(error);
                    this.isLoading = false;
                }
            });
        }
    }

    private populateForm(platform: Platform): void {
        this.platformForm.patchValue({
            name: platform.name,
            description: platform.description,
            iconUrl: platform.iconUrl,
            order: platform.order,
            isActive: platform.isActive
        });

        if (platform.iconUrl) {
            this.iconPreview = platform.iconUrl;
        }

        // Clear and populate solutions
        this.solutions.clear();
        platform.solutions.forEach(solution => {
            const solutionGroup = this.fb.group({
                id: [solution.id],
                title: [solution.title, Validators.required],
                description: [solution.description, Validators.required],
                features: this.fb.array(solution.features.map(f => this.fb.control(f, Validators.required))),
                iconUrl: [solution.iconUrl || ''],
                order: [solution.order]
            });
            this.solutions.push(solutionGroup);
        });
    }

    onIconSelected(event: any): void {
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

            this.selectedIcon = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.iconPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    removeIcon(): void {
        this.selectedIcon = null;
        this.iconPreview = null;
        this.platformForm.patchValue({ iconUrl: '' });
    }

    async uploadIcon(): Promise<string | null> {
        if (!this.selectedIcon) return null;

        this.isUploadingIcon = true;
        const fileName = this.storageService.generateFileName(this.selectedIcon.name);

        try {
            const platformIdStr = this.platformId || this.generateTempId();
            const path = `platforms/icons/${platformIdStr}/${fileName}`;

            const iconUrl = await this.storageService.uploadImage(this.selectedIcon, path).toPromise();
            this.isUploadingIcon = false;
            return iconUrl || null;
        } catch (error) {
            this.isUploadingIcon = false;
            toast.error('Error al subir el ícono');
            console.error(error);
            return null;
        }
    }

    private generateTempId(): string {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async onSubmit(): Promise<void> {
        if (this.platformForm.valid) {
            this.isLoading = true;

            try {
                let iconUrl: string | undefined = this.platformForm.value.iconUrl;

                if (this.selectedIcon) {
                    const uploadedUrl = await this.uploadIcon();
                    if (!uploadedUrl) {
                        this.isLoading = false;
                        return;
                    }
                    iconUrl = uploadedUrl;
                }

                const formData: CreatePlatformRequest = {
                    ...this.platformForm.value,
                    iconUrl: iconUrl || ''
                };

                if (this.isEditMode && this.platformId) {
                    this.platformService.updatePlatform(this.platformId, formData).subscribe({
                        next: () => {
                            toast.success('Plataforma actualizada exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/platforms']);
                        },
                        error: (error: any) => {
                            this.handleRequestError(error);
                            this.isLoading = false;
                        }
                    });
                } else {
                    this.platformService.createPlatform(formData).subscribe({
                        next: () => {
                            toast.success('Plataforma creada exitosamente!');
                            this.router.navigate(['/layout/vzor-cms/platforms']);
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
            this.platformForm.markAllAsTouched();
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/platforms']);
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
