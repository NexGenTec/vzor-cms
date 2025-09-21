import { Component, Input } from '@angular/core';
import { Task } from '../../../../../dashboard/models/task';
import { TasksService } from '../../../task/service/tasks.service';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NgFor, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-constructora-auctions-table]',
  standalone: true,
  imports: [NgFor,CommonModule,AngularSvgIconModule,RouterLink,ReactiveFormsModule],
  templateUrl: './constructora-auctions-table.component.html',
  styleUrl: './constructora-auctions-table.component.scss'
})
export class ConstructoraAuctionsTableComponent {
  public activeAuction: Task[] = [];
  @Input() task!: Task;
  public tasks: Task[] = [];
  public isLoading = true;

  constructor( 
    private taskService: TasksService,
    private router: Router) {
      
  }

  loadTask() {
    this.taskService.getTasks().subscribe({
      next: (task: Task[]) => {
        // this.tasks = task;
        this.tasks = task.slice(-8); 
        this.isLoading = false;
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoading = false;
      },
    });
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

  ngOnInit(): void {
    this.loadTask();
  }

  viewTask(taskId: string) {
    this.router.navigate(['/layout/dashboard/task', taskId]);
  }
}
