import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';
import { TaskService } from '../../../../../dashboard/service/task.service';
import { Task } from '../../../../../dashboard/models/task';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: '[app-constructora-chart-card]',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './constructora-chart-card.component.html',
  styleUrl: './constructora-chart-card.component.scss'
})
export class ConstructoraChartCardComponent implements OnInit, OnDestroy {
  public chartOptions: ApexOptions = {
    series: [0, 0],
    chart: {
      type: 'donut',
      height: 280
    },
    labels: ['Completadas', 'Pendientes'],
    colors: ['#10B981', '#F59E0B'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#111827'
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontWeight: 500
    }
  };
  
  public isLoading = true;
  public taskStats = {
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  };
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTaskData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTaskData(): void {
    this.isLoading = true;
    this.taskService.getTasks().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (tasks: Task[]) => {
        this.updateChartData(tasks);
        this.updateTaskStats(tasks);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks for chart:', error);
        this.isLoading = false;
        this.updateChartData([]);
        this.updateTaskStats([]);
      }
    });
  }

  updateChartData(tasks: Task[]): void {
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    this.chartOptions = {
      series: [completedTasks, pendingTasks],
      chart: {
        type: 'donut',
        height: 280
      },
      labels: ['Completadas', 'Pendientes'],
      colors: ['#10B981', '#F59E0B'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151'
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: '#111827'
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500
      }
    };
  }

  updateTaskStats(tasks: Task[]): void {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.taskStats = {
      total,
      completed,
      pending,
      completionRate
    };
  }
}

