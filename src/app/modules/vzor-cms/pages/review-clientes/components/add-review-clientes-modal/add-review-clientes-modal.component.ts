import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReviewCliente, CreateReviewRequest } from '../../../../models/review-clientes.model';

@Component({
  selector: 'app-add-review-clientes-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review-clientes-modal.component.html',
  styleUrl: './add-review-clientes-modal.component.scss'
})
export class AddReviewClientesModalComponent implements OnInit {
  @Input() review: ReviewCliente | null = null;
  @Output() save = new EventEmitter<CreateReviewRequest>();
  @Output() cancel = new EventEmitter<void>();

  reviewForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEditMode = !!this.review;
    this.reviewForm = this.fb.group({
      clientName: [this.review?.clientName || '', Validators.required],
      project: [this.review?.project || '', Validators.required],
      rating: [this.review?.rating || 5, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: [this.review?.review || '', Validators.required],
      projectType: [this.review?.projectType || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.save.emit(this.reviewForm.value);
    } else {
      this.reviewForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.cancel.emit();
  }
}