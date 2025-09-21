import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../../project/service/project.service';
import { Project } from '../../../../project/project.component';

interface User { 
  id?: string; 
  name: string; 
  email: string; 
}

interface Task { 
  id?: string; 
  title: string; 
  description: string; 
  priority: string; 
  dueDate?: string; 
}

interface Product { 
  id?: string; 
  name: string; 
  quantity: number; 
  unitPrice: number; 
}

interface Team { 
  id?: string; 
  name: string; 
  role: string; 
  assignedUsers: User[]; 
}

// Extender la interfaz Project del componente principal
interface ExtendedProject extends Project {
  budget?: number;
  equipos?: Team[];
  productos?: Product[];
  tareas?: Task[];
}

@Component({
  selector: 'app-add-project-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-project-modal.component.html',
  styleUrl: './add-project-modal.component.scss'
})
export class AddProjectModalComponent implements OnInit, OnChanges {
  @Input() project: ExtendedProject | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveProject = new EventEmitter<ExtendedProject>();

  projectForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private projectsService: ProjectsService) {}

  ngOnInit() {
    this.initForm();
    if (this.project) {
      this.patchFormWithProject();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.projectForm) {
      this.patchFormWithProject();
    }
  }

  initForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['', [Validators.required, Validators.maxLength(30)]],
      budget: [0, [Validators.min(0)]],
      equipos: this.fb.array([]),
      productos: this.fb.array([]),
      tareas: this.fb.array([]),
    });
  }

  patchFormWithProject() {
    if (this.project) {
      // Limpiar arrays existentes
      this.clearFormArrays();
      
      // Parchar valores básicos
      this.projectForm.patchValue({
        name: this.project.name,
        category: this.project.category,
        description: this.project.description,
        status: this.project.status || 'Activo',
        budget: this.project.budget || 0,
      });

      // Parchar equipos
      if (this.project.equipos) {
        this.project.equipos.forEach(equipo => {
          this.addTeam(equipo);
        });
      }

      // Parchar productos
      if (this.project.productos) {
        this.project.productos.forEach(producto => {
          this.addProduct(producto);
        });
      }

      // Parchar tareas
      if (this.project.tareas) {
        this.project.tareas.forEach(tarea => {
          this.addTask(tarea);
        });
      }
    }
  }

  clearFormArrays() {
    while (this.equiposArray.length !== 0) {
      this.equiposArray.removeAt(0);
    }
    while (this.productosArray.length !== 0) {
      this.productosArray.removeAt(0);
    }
    while (this.tareasArray.length !== 0) {
      this.tareasArray.removeAt(0);
    }
  }

  // Getters para FormArrays
  get equiposArray() { return this.projectForm.get('equipos') as FormArray; }
  get productosArray() { return this.projectForm.get('productos') as FormArray; }
  get tareasArray() { return this.projectForm.get('tareas') as FormArray; }

  // Métodos para Equipos
  addTeam(existingTeam?: Team) {
    const teamGroup = this.fb.group({
      name: [existingTeam?.name || '', Validators.required],
      role: [existingTeam?.role || '', Validators.required],
      assignedUsers: this.fb.array([])
    });

    if (existingTeam?.assignedUsers) {
      existingTeam.assignedUsers.forEach(user => {
        this.addTeamUser(this.equiposArray.length, user);
      });
    } else {
      // Agregar un usuario por defecto
      this.addTeamUser(this.equiposArray.length);
    }

    this.equiposArray.push(teamGroup);
  }

  removeTeam(index: number) {
    this.equiposArray.removeAt(index);
  }

  getTeamUsers(teamIndex: number): FormArray {
    return this.equiposArray.at(teamIndex).get('assignedUsers') as FormArray;
  }

  addTeamUser(teamIndex: number, existingUser?: User) {
    const userGroup = this.fb.group({
      name: [existingUser?.name || '', Validators.required],
      email: [existingUser?.email || '', [Validators.required, Validators.email]]
    });
    this.getTeamUsers(teamIndex).push(userGroup);
  }

  removeTeamUser(teamIndex: number, userIndex: number) {
    this.getTeamUsers(teamIndex).removeAt(userIndex);
  }

  // Métodos para Productos
  addProduct(existingProduct?: Product) {
    const productGroup = this.fb.group({
      name: [existingProduct?.name || '', Validators.required],
      quantity: [existingProduct?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [existingProduct?.unitPrice || 0, [Validators.required, Validators.min(0)]]
    });
    this.productosArray.push(productGroup);
  }

  removeProduct(index: number) {
    this.productosArray.removeAt(index);
  }

  // Métodos para Tareas
  addTask(existingTask?: Task) {
    const taskGroup = this.fb.group({
      title: [existingTask?.title || '', Validators.required],
      description: [existingTask?.description || ''],
      priority: [existingTask?.priority || 'Media', Validators.required],
      dueDate: [existingTask?.dueDate || '']
    });
    this.tareasArray.push(taskGroup);
  }

  removeTask(index: number) {
    this.tareasArray.removeAt(index);
  }

  // Método para enviar el formulario
  onSubmit() {
    this.isSubmitting = true;
    
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const formValue = this.projectForm.value;
    const projectData: ExtendedProject = {
      id: this.project?.id || '',
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      status: formValue.status,
      createdAt: this.project?.createdAt || new Date().toISOString(),
      uid: this.project?.uid || '',
      budget: formValue.budget,
      equipos: formValue.equipos,
      productos: formValue.productos,
      tareas: formValue.tareas
    };

    if (this.project?.id) {
      // Actualizar proyecto existente
      this.projectsService.updateProject(this.project.id, projectData).then(() => {
        this.saveProject.emit(projectData);
        this.closeModal();
        this.isSubmitting = false;
      }).catch((error: any) => {
        console.error('Error updating project:', error);
        this.isSubmitting = false;
      });
    } else {
      // Crear nuevo proyecto
      this.projectsService.addProject(projectData).subscribe({
        next: () => {
          this.saveProject.emit(projectData);
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Error creating project:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
