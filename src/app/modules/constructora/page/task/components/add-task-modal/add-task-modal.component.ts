import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Task } from '../../../../../dashboard/models/task';
import { User } from '../../../../../management/models/user';
import { TaskService } from '../../../../../dashboard/service/task.service';
import { UserService } from '../../../../../management/service/user.service';
import { AuthService } from '../../../../../auth/service/auth.service';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
})
export class AddTaskModalComponent {
  @Input() isOpen = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  taskForm: FormGroup;
  @Input() task!: Task ;
    users$: Observable<User[]> = this.userService.getAllUsers();
    user: User | null = null;
    filteredUsers: User[] = []; 

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService, 
    private router: Router,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.users$ = this.userService.getAllUsers();
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        dueDate: this.task.dueDate,
        createdAt: this.task.createdAt,
        assignedTo: this.task.assignedTo || '',
        tags: this.task.tags,
        selected: this.task.selected,
        completed: this.task.completed,
      });
    }
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userService.getUserData(user.uid).subscribe(userData => {
          this.user = userData;
          this.taskForm.patchValue({
            usuarioSolicitante: this.user?.name,
          });
          this.users$.subscribe(users => {
            this.filteredUsers = users.filter(u => u.uid !== this.user?.uid);
          });
        });
      }
    });
  }  

  addTask() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      
      if (this.task && this.task.id) {
        // Editar la tarea existente
        this.taskService.updateTask(this.task.id, task)
          .then(() => {
            toast.success('Tarea editada exitosamente.', {
              position: 'top-right',
              action: {
                label: 'Deshacer',
                onClick: () => console.log('¡Acción deshecha!'),
              },
              actionButtonStyle: 'background-color:#DC2626; color:white;',
            });
            this.closeModal();
          })
          .catch((error: any) => {
            toast.error('Hubo un error al editar la tarea.', {
              position: 'top-right',
            });
            console.error('Error al editar la tarea: ', error);
            
            // Redirigir según el código de error
            if (error.status === 404) {
              this.router.navigate(['/errors/404']);
            } else if (error.status === 500) {
              this.router.navigate(['/errors/500']);
            }
          });
      } else {
        // Crear una nueva tarea
        this.taskService.addTask(task).subscribe({
          next: () => {
            toast.success('Tarea agregada exitosamente.', {
              position: 'top-right',
              action: {
                label: 'Deshacer',
                onClick: () => console.log('¡Acción deshecha!'),
              },
              actionButtonStyle: 'background-color:#DC2626; color:white;',
            });
            this.closeModal();
          },
          error: (error: any) => {
            toast.error('Hubo un error al agregar la tarea.', {
              position: 'top-right',
            });
            console.error('Error al agregar la tarea: ', error);
            
            // Redirigir según el código de error
            if (error.status === 404) {
              this.router.navigate(['/errors/404']);
            } else if (error.status === 500) {
              this.router.navigate(['/errors/500']);
            }
          }
        });
      }
    } else {
      toast.error('Por favor, complete todos los campos correctamente.', {
        position: 'top-right',
      });
    }
  }  

  // Close the modal
  closeModal() {
    this.closeModalEvent.emit();
  }
}
