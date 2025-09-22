import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Recurso, CreateRecursoRequest } from '../../../../models/recursos.model';

@Component({
  selector: 'app-add-recursos-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-recursos-modal.component.html',
  styleUrl: './add-recursos-modal.component.scss'
})
export class AddRecursosModalComponent implements OnInit {
  @Input() recurso: Recurso | null = null;
  @Output() save = new EventEmitter<CreateRecursoRequest>();
  @Output() cancel = new EventEmitter<void>();

  recursoForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEditMode = !!this.recurso;
    this.recursoForm = this.fb.group({
      title: [this.recurso?.title || '', Validators.required],
      description: [this.recurso?.description || '', Validators.required],
      type: [this.recurso?.type || '', Validators.required],
      category: [this.recurso?.category || '', Validators.required],
      downloads: [this.recurso?.downloads || 0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.recursoForm.valid) {
      this.save.emit(this.recursoForm.value);
    } else {
      this.recursoForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.cancel.emit();
  }
}