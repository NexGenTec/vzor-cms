import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SolutionTabService } from '../../../../services/solution-tab.service';
import { CreateSolutionTabRequest, SolutionTab, SolutionTabSolution } from '../../../../models/solution-tab.model';

@Component({
  selector: 'app-solution-tab-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solution-tab-form.component.html',
  styleUrl: './solution-tab-form.component.scss'
})
export class SolutionTabFormComponent implements OnInit {
  tabForm!: FormGroup;
  isEditMode = false;
  tabId: string | null = null;
  isLoading = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solutionTabService = inject(SolutionTabService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.tabForm = this.fb.group({
      id: ['', Validators.required],
      label: ['', Validators.required],
      href: ['', Validators.required],
      color: ['#00B5E2', Validators.required],
      contentTitle: ['', Validators.required],
      contentText: ['', Validators.required],
      solutions: this.fb.array([])
    });

    // Inicializar con al menos una solución
    this.addSolution();
  }

  get solutions(): FormArray {
    return this.tabForm.get('solutions') as FormArray;
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tabId = id;
      this.loadSolutionTab();
    }
  }

  private loadSolutionTab(): void {
    if (!this.tabId) return;

    this.isLoading = true;
    this.solutionTabService.getSolutionTabById(this.tabId).subscribe({
      next: (tab: SolutionTab | undefined) => {
        if (tab) {
          this.populateForm(tab);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        toast.error('Error al cargar el tab de soluciones');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  private populateForm(tab: SolutionTab): void {
    this.tabForm.patchValue({
      id: tab.id,
      label: tab.label,
      href: tab.href,
      color: tab.color,
      contentTitle: tab.contentTitle,
      contentText: tab.contentText
    });

    // Limpiar soluciones actuales
    while (this.solutions.length !== 0) {
      this.solutions.removeAt(0);
    }

    if (tab.solutions && tab.solutions.length > 0) {
      tab.solutions.forEach(solution => this.addSolution(solution));
    } else {
      this.addSolution();
    }
  }

  addSolution(solution?: SolutionTabSolution): void {
    const group = this.fb.group({
      id: [solution?.id ?? this.solutions.length + 1, Validators.required],
      title: [solution?.title || '', Validators.required],
      desc: [solution?.desc || '', Validators.required],
      color: [solution?.color || ''],
      imgKey: [solution?.imgKey || ''],
      href: [solution?.href || ''],
    });

    this.solutions.push(group);
  }

  removeSolution(index: number): void {
    if (this.solutions.length > 1) {
      this.solutions.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.tabForm.invalid) {
      this.tabForm.markAllAsTouched();
      toast.error('Por favor, complete todos los campos obligatorios');
      return;
    }

    this.isLoading = true;

    const formValue = this.tabForm.value;
    const payload: CreateSolutionTabRequest = {
      id: formValue.id,
      label: formValue.label,
      href: formValue.href,
      color: formValue.color,
      contentTitle: formValue.contentTitle,
      contentText: formValue.contentText,
      solutions: formValue.solutions as SolutionTabSolution[]
    };

    if (this.isEditMode && this.tabId) {
      this.solutionTabService.updateSolutionTab(this.tabId, payload).subscribe({
        next: () => {
          toast.success('Tab de soluciones actualizado exitosamente!');
          this.router.navigate(['/layout/vzor-cms/solution-tabs']);
        },
        error: (error: any) => {
          this.handleRequestError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.solutionTabService.createSolutionTab(payload).subscribe({
        next: () => {
          toast.success('Tab de soluciones creado exitosamente!');
          this.router.navigate(['/layout/vzor-cms/solution-tabs']);
        },
        error: (error: any) => {
          this.handleRequestError(error);
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/layout/vzor-cms/solution-tabs']);
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


