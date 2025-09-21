import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { TaskService } from '../../../service/task.service';
import { Task } from '../../../models/task';
import { toast } from 'ngx-sonner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: '[nft-auctions-table]',
    templateUrl: './nft-auctions-table.component.html',
    standalone: true,
    imports: [NgFor,CommonModule,AngularSvgIconModule,RouterLink,ReactiveFormsModule],
})
export class NftAuctionsTableComponent implements OnInit {
  public activeAuction: Task[] = [];
  @Input() task!: Task;
  public tasks: Task[] = [];
  public isLoading = true;

  constructor( 
    private taskService: TaskService,
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
