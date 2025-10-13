import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { BlogService } from '../../../../services/blog.service';
import { StorageService } from '../../../../services/storage.service';
import { BlogPost, CreateBlogPostRequest, BlogSection } from '../../../../models/blog.model';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.scss'
})
export class BlogFormComponent implements OnInit {
  blogForm!: FormGroup;
  isEditMode = false;
  blogPostId: string | null = null;
  isLoading = false;
  selectedMainImage: File | null = null;
  mainImagePreview: string | null = null;
  isUploadingMainImage = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      status: ['draft', Validators.required],
      sections: this.fb.array([])
    });

    // Inicializar con al menos una sección
    this.addSection();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.blogPostId = id;
      this.loadBlogPost();
    }
  }

  private loadBlogPost(): void {
    if (this.blogPostId) {
      this.isLoading = true;
      this.blogService.getBlogPostById(this.blogPostId).subscribe({
        next: (post: BlogPost | undefined) => {
          if (post) {
            this.populateForm(post);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          toast.error('Error al cargar el post');
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  private populateForm(post: BlogPost): void {
    this.blogForm.patchValue({
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      status: post.status
    });

    // Mostrar imagen existente en modo edición
    if (post.mainImageUrl) {
      this.mainImagePreview = post.mainImageUrl;
    } else {
      this.mainImagePreview = null;
    }
    this.selectedMainImage = null;

    // Limpiar secciones existentes
    while (this.sections.length !== 0) {
      this.sections.removeAt(0);
    }

    // Agregar secciones del post
    if (post.sections && post.sections.length > 0) {
      post.sections.forEach(section => this.addSection(section));
    } else {
      this.addSection();
    }
  }

  get sections(): FormArray {
    return this.blogForm.get('sections') as FormArray;
  }

  addSection(section?: BlogSection): void {
    const sectionForm = this.fb.group({
      f_title: [section?.f_title || '', Validators.required],
      f_subtitle: [section?.f_subtitle || '', Validators.required],
      f_paragraph: [section?.f_paragraph || '', Validators.required],
      f_img: [section?.f_img || []],
      f_media_links: [section?.f_media_links || []]
    });
    this.sections.push(sectionForm);
  }

  removeSection(index: number): void {
    if (this.sections.length > 1) {
      this.sections.removeAt(index);
    }
  }

  addImageToSection(sectionIndex: number): void {
    const section = this.sections.at(sectionIndex);
    const currentImages = section.get('f_img')?.value || [];
    section.get('f_img')?.setValue([...currentImages, '']);
  }

  removeImageFromSection(sectionIndex: number, imageIndex: number): void {
    const section = this.sections.at(sectionIndex);
    const currentImages = section.get('f_img')?.value || [];
    currentImages.splice(imageIndex, 1);
    section.get('f_img')?.setValue([...currentImages]);
  }

  addMediaLinkToSection(sectionIndex: number): void {
    const section = this.sections.at(sectionIndex);
    const currentLinks = section.get('f_media_links')?.value || [];
    section.get('f_media_links')?.setValue([...currentLinks, '']);
  }

  removeMediaLinkFromSection(sectionIndex: number, linkIndex: number): void {
    const section = this.sections.at(sectionIndex);
    const currentLinks = section.get('f_media_links')?.value || [];
    currentLinks.splice(linkIndex, 1);
    section.get('f_media_links')?.setValue([...currentLinks]);
  }

  onSectionImageSelected(event: any, sectionIndex: number, imageIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      // Subir imagen a Firebase Storage
      this.uploadSectionImage(file, sectionIndex, imageIndex);
    }
  }

  private async uploadSectionImage(file: File, sectionIndex: number, imageIndex: number): Promise<void> {
    try {
      const fileName = this.storageService.generateFileName(file.name);
      // Usar el ID del blog si existe, o generar uno temporal
      const blogId = this.blogPostId || this.generateTempId();
      const path = `blog/${blogId}/sections/section-${sectionIndex}/${fileName}`;
      
      const imageUrl = await this.storageService.uploadImage(file, path).toPromise();
      
      if (imageUrl) {
        // Actualizar el valor en el formulario
        const section = this.sections.at(sectionIndex);
        const images = section.get('f_img')?.value || [];
        images[imageIndex] = imageUrl;
        section.get('f_img')?.setValue(images);
        
        toast.success('Imagen subida correctamente');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('Error al subir la imagen');
    }
  }

  updateImageValue(sectionIndex: number, imageIndex: number, event: any): void {
    // Este método ya no se usa, pero lo mantenemos por compatibilidad
    const section = this.sections.at(sectionIndex);
    const currentImages = section.get('f_img')?.value || [];
    currentImages[imageIndex] = event.target.value;
    section.get('f_img')?.setValue([...currentImages]);
  }

  updateMediaLinkValue(sectionIndex: number, linkIndex: number, event: any): void {
    const section = this.sections.at(sectionIndex);
    const currentLinks = section.get('f_media_links')?.value || [];
    currentLinks[linkIndex] = event.target.value;
    section.get('f_media_links')?.setValue([...currentLinks]);
  }

  getSectionPrefix(index: number): string {
    return index === 0 ? 'f' : 's';
  }

  onMainImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      this.selectedMainImage = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mainImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeMainImage(): void {
    this.selectedMainImage = null;
    this.mainImagePreview = null;
  }

  async uploadMainImage(): Promise<string | null> {
    if (!this.selectedMainImage) return null;

    this.isUploadingMainImage = true;
    const fileName = this.storageService.generateFileName(this.selectedMainImage.name);
    
    try {
      // Usar el ID del blog si existe, o generar uno temporal
      const blogId = this.blogPostId || this.generateTempId();
      const path = `blog/${blogId}/main/${fileName}`;
      
      const imageUrl = await this.storageService.uploadImage(this.selectedMainImage, path).toPromise();
      this.isUploadingMainImage = false;
      return imageUrl || null;
    } catch (error) {
      this.isUploadingMainImage = false;
      toast.error('Error al subir la imagen');
      console.error(error);
      return null;
    }
  }

  private generateTempId(): string {
    return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async onSubmit(): Promise<void> {
    if (this.blogForm.valid) {
      // Validar que haya una imagen (nueva o existente)
      if (!this.selectedMainImage && !this.mainImagePreview) {
        toast.error('Por favor, selecciona una imagen principal para el post');
        return;
      }

      this.isLoading = true;
      
      try {
        let mainImageUrl: string | undefined = undefined;
        
        // Si hay una imagen nueva seleccionada, subirla
        if (this.selectedMainImage) {
          const uploadedUrl = await this.uploadMainImage();
          if (!uploadedUrl) {
            this.isLoading = false;
            return;
          }
          mainImageUrl = uploadedUrl;
        } else if (this.mainImagePreview) {
          // Si hay una imagen existente (modo edición), usar la existente
          mainImageUrl = this.mainImagePreview;
        }

        const formData: CreateBlogPostRequest = {
          ...this.blogForm.value,
          mainImageUrl: mainImageUrl
        };

        if (this.isEditMode && this.blogPostId) {
          // Actualizar post existente
          this.blogService.updateBlogPost(this.blogPostId, formData).subscribe({
            next: () => {
              toast.success('Post actualizado exitosamente!');
              this.router.navigate(['/layout/vzor-cms/blog']);
            },
            error: (error: any) => {
              this.handleRequestError(error);
              this.isLoading = false;
            }
          });
        } else {
          // Crear nuevo post
          this.blogService.createBlogPost(formData).subscribe({
            next: () => {
              toast.success('Post creado exitosamente!');
              this.router.navigate(['/layout/vzor-cms/blog']);
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
      this.blogForm.markAllAsTouched();
      toast.error('Por favor, complete todos los campos obligatorios');
    }
  }

  goBack(): void {
    this.router.navigate(['/layout/vzor-cms/blog']);
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
