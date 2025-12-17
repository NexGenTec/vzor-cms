import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { SolutionService } from '../../../../services/solution.service';
import { CreateSolutionItemRequest, SolutionItem } from '../../../../models/solution.model';

@Component({
  selector: 'app-solution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solution-form.component.html',
  styleUrl: './solution-form.component.scss'
})
export class SolutionFormComponent implements OnInit {
  solutionForm!: FormGroup;
  isEditMode = false;
  solutionId: string | null = null;
  isLoading = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solutionService = inject(SolutionService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.solutionForm = this.fb.group({
      name: ['', Validators.required],
      sectionTitle: ['', Validators.required],
      subtitle: [''],
      shortDescription: ['', Validators.required],
      imgKey: [''],
      order: [0],
      isPublished: [false]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.solutionId = id;
      this.loadSolution();
    }
  }

  private loadSolution(): void {
    if (this.solutionId) {
      this.isLoading = true;
      this.solutionService.getSolutionById(this.solutionId).subscribe({
        next: (solution: SolutionItem | undefined) => {
          if (solution) {
            this.populateForm(solution);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          toast.error('Error al cargar la solución');
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  private populateForm(solution: SolutionItem): void {
    this.solutionForm.patchValue({
      name: solution.name,
      sectionTitle: solution.sectionTitle,
      subtitle: solution.subtitle,
      shortDescription: solution.shortDescription,
      imgKey: solution.imgKey,
      order: solution.order,
      isPublished: solution.isPublished
    });
  }

  onSubmit(): void {
    if (this.solutionForm.valid) {
      this.isLoading = true;

      const formData: CreateSolutionItemRequest = {
        ...this.solutionForm.value
      };

      if (this.isEditMode && this.solutionId) {
        this.solutionService.updateSolution(this.solutionId, formData).subscribe({
          next: () => {
            toast.success('Solución actualizada exitosamente!');
            this.router.navigate(['/layout/vzor-cms/solutions']);
          },
          error: (error: any) => {
            this.handleRequestError(error);
            this.isLoading = false;
          }
        });
      } else {
        this.solutionService.createSolution(formData).subscribe({
          next: () => {
            toast.success('Solución creada exitosamente!');
            this.router.navigate(['/layout/vzor-cms/solutions']);
          },
          error: (error: any) => {
            this.handleRequestError(error);
            this.isLoading = false;
          }
        });
      }
    } else {
      this.solutionForm.markAllAsTouched();
      toast.error('Por favor, complete todos los campos obligatorios');
    }
  }

  goBack(): void {
    this.router.navigate(['/layout/vzor-cms/solutions']);
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


