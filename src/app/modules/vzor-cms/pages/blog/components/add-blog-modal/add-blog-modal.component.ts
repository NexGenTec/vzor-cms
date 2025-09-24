import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { BlogPost, CreateBlogPostRequest, BlogSection } from '../../../../models/blog.model';

@Component({
  selector: 'app-add-blog-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-blog-modal.component.html',
  styleUrl: './add-blog-modal.component.scss'
})
export class AddBlogModalComponent implements OnInit {
  @Input() blogPost: BlogPost | null = null;
  @Output() save = new EventEmitter<CreateBlogPostRequest>();
  @Output() cancel = new EventEmitter<void>();

  blogForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEditMode = !!this.blogPost;
    this.blogForm = this.fb.group({
      title: [this.blogPost?.title || '', Validators.required],
      excerpt: [this.blogPost?.excerpt || '', Validators.required],
      author: [this.blogPost?.author || '', Validators.required],
      category: [this.blogPost?.category || '', Validators.required],
      status: [this.blogPost?.status || 'draft', Validators.required],
      sections: this.fb.array([])
    });

    // Inicializar con al menos una sección
    if (this.blogPost?.sections && this.blogPost.sections.length > 0) {
      this.blogPost.sections.forEach(section => this.addSection(section));
    } else {
      this.addSection();
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      this.save.emit(this.blogForm.value);
    } else {
      this.blogForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.cancel.emit();
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

  getSectionPrefix(index: number): string {
    return index === 0 ? 'f' : 's';
  }

  updateImageValue(sectionIndex: number, imageIndex: number, event: any): void {
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
}