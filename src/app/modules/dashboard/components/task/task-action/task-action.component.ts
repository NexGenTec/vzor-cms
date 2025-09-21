import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaskFilterService } from '../../../service/task-filter.service';
import { Task } from '../../../models/task';
import { TaskService } from '../../../service/task.service';

@Component({
  selector: 'app-task-action',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './task-action.component.html',
  styleUrl: './task-action.component.scss'
})
export class TaskActionComponent {
  tasks: Task[] = [];
  filteredTask: Task[] = [];

  constructor(
    private taskFilter: TaskFilterService,
    private TaskService: TaskService
  ) {}

  ngOnInit() {
    this.TaskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTask = tasks;
    });
  }

  onSearchChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.taskFilter.searchField.set(input.value);
  }

  onPriorityChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.taskFilter.priorityField.set(selectElement.value);
  }

  onStatusChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.taskFilter.statusField.set(selectElement.value);
  }

  onOrderChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.taskFilter.orderField.set(selectElement.value);
  }

}

