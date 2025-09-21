import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { TaskFooterComponent } from './components/task-footer/task-footer.component';
import { TaskActionComponent } from './components/task-action/task-action.component';
import { TaskRowComponent } from './components/task-row/task-row.component';
import { TaskHeaderComponent } from './components/task-header/task-header.component';
import { AddTaskModalComponent } from './components/add-task-modal/add-task-modal.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import { Task } from '../../../dashboard/models/task';
import { TasksService } from './service/tasks.service';
import { TasksFilterService } from './service/tasks-filter.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [    
    AngularSvgIconModule,
    FormsModule,
    TaskFooterComponent,
    TaskActionComponent,
    TaskRowComponent,
    TaskHeaderComponent,
    AddTaskModalComponent,
    CommonModule,
    ModalComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  task = signal<Task[]>([]);
  isModalOpen = false;
  tasks: Task[] = [];
  selectedTask!: Task ;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;


  constructor(
    private filterService: TasksFilterService,
    private taskService: TasksService,
  ) {
    this.loadTask();
  }

  loadTask() {
    this.taskService.getTasks().subscribe({
      next: (task: Task[]) => {
        this.task.update(() => task);
      },
      error: (error) => {
        this.handleRequestError(error);
      }
    });
  }

  toggleTasks(checked: boolean) {
    this.task.update((tasks) =>
      tasks.map((task) => ({ ...task, selected: checked }))
    );
  }

  handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener las tareas. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
      action: {
        label: 'Deshacer',
        onClick: () => console.log('¡Acción deshecha!'),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  filteredTask = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const priority = this.filterService.priorityField();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();

    // Filtrar por búsqueda
    const filteredBySearch = this.task().filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search) ||
                            task.description.toLowerCase().includes(search) ||
                            task.dueDate.toLowerCase().includes(search) ||
                            task.assignedTo.toLowerCase().includes(search) ||
                            (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(search)));
      return matchesSearch;
    });
  
    // Filtrar por prioridad
    const filteredByPriority = filteredBySearch.filter((task) => {
      const matchesPriority = !priority || task.priority.toLowerCase() === priority.toLowerCase();
      return matchesPriority;
    });
  
    // Filtrar por estado
    const filteredByStatus = filteredByPriority.filter((task) => {
      let matchesStatus = true;
      if (status) {
        switch (status) {
          case 'Pendiente':
            matchesStatus = !task.completed;
            break;
          case 'Completada':
            matchesStatus = task.completed;
            break;
          default:
            matchesStatus = true;
            break;
        }
      }
      return matchesStatus;
    });
  
    // Ordenar las tareas
    const sortedByDate = filteredByStatus.sort((a, b) => {
      const defaultNewest = !order || order === '1';
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (defaultNewest) {
        return dateB.getTime() - dateA.getTime();
      } else if (order === '2') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === '3') {
        return a.priority.localeCompare(b.priority);
      } else if (order === '4') {
        return b.priority.localeCompare(a.priority);
      }      
      return 0;
    });
  
    return sortedByDate;
  });  

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTask = {} as Task; 
  }

  openEditModal(task: Task) {
    this.selectedTask = task;
    this.openModal();
  }

  openExportConfirmation(exportType: 'pdf' | 'csv') {
    this.isExporting = exportType;
    this.isModalOpenExport = true;
  }

  // Handle export after confirmation
  handleExportConfirmation(exportType: 'pdf' | 'csv') {
    if (exportType === 'pdf') {
      this.exportToPDF();
    } else if (exportType === 'csv') {
      this.exportToCSV();
    }
    this.isModalOpenExport = false;
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Lista de Tareas', 14, 10);
  
    const columns = ['Título', 'Descripción', 'Fecha Límite', 'Asignado A'];
    const rows = this.filteredTask().map(task => [
      task.title,
      task.description,
      task.dueDate,
      task.assignedTo
    ]);
  
    autoTable(doc, { head: [columns], body: rows });
    doc.save('tareas.pdf');
  
    toast.success('La exportación a PDF se ha realizado con éxito!', {
      position: 'top-right',
      duration: 5000,
    });
  }
  
  exportToCSV() {
    try {
      const csvData = this.filteredTask().map(task => ({
        Título: task.title,
        Descripción: task.description,
        'Fecha Límite': task.dueDate,
        'Asignado A': task.assignedTo
      }));
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tareas.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('La exportación a CSV se ha realizado con éxito!', {
        position: 'top-right',
        duration: 1000,
        actionButtonStyle: 'background-color:#DC2626; color:green;',
      });
    } catch (error) {
      this.handleRequestError(error);
    }
  }
}