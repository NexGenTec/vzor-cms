import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BlogPost, CreateBlogPostRequest } from '../../../../models/blog.model';

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
    });
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
}