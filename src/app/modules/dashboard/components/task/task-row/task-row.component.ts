import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Task } from '../../../models/task';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskFilterService } from '../../../service/task-filter.service';
import { TaskService } from '../../../service/task.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: '[app-task-row]',
  standalone: true,
  imports: [AngularSvgIconModule,FormsModule,CommonModule],
  templateUrl: './task-row.component.html',
  styleUrl: './task-row.component.scss'
})
export class TaskRowComponent {
  @Input() task: Task = <Task>{};
  @Input() onEditTask: (task: Task) => void = () => {};
  @Output() selectedChange = new EventEmitter<boolean>();

  // Modal state
  isDeleteModalOpen: boolean = false;
  taskToDeleteId: string = ''; // Store the task ID to delete

  constructor(
    private taskService: TaskService,
    private router: Router) {}

  toggleSelection() {
    this.task.selected = !this.task.selected;
    this.selectedChange.emit(this.task.selected);
  }

  editTask(task: Task) {
    this.onEditTask(task);
  }

  // Open the delete confirmation modal
  openDeleteModal(taskId: string) {
    this.isDeleteModalOpen = true;
    this.taskToDeleteId = taskId;
  }

  // Close the delete confirmation modal
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.taskToDeleteId = '';
  }

  // Confirm the deletion
  confirmDelete() {
    if (this.taskToDeleteId) {
      this.deleteTask(this.taskToDeleteId);
      this.closeDeleteModal(); 
    }
  }

  // Eliminar la tarea
  deleteTask(id: string) {
    this.taskService.deleteTask(id).then(() => {
      toast.success('Tarea eliminada con éxito', {
        position: 'top-right',
        description: 'La tarea se ha eliminado correctamente.',
        action: {
          label: 'Deshacer',
          onClick: () => console.log('Acción deshecha'),
        },
        actionButtonStyle: 'background-color:#DC2626; color:white;',
      });
    }).catch((error) => {
      console.error('Error al eliminar la tarea:', error);
      toast.error('Error deleting the task', {
        position: 'top-right',
        description: error.message || 'No se pudo eliminar la tarea.',
      });
    });
  }

  viewTask(taskId: string) {
    this.router.navigate(['/layout/dashboard/task', taskId]);
  }
}