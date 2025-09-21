import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Task } from '../../../../../dashboard/models/task';
import { TasksService } from '../../service/tasks.service';

@Component({
  selector: 'app-profile-task',
  standalone: true,
  imports: [AngularSvgIconModule, FormsModule, CommonModule,NgClass],
  templateUrl: './profile-task.component.html',
  styleUrl: './profile-task.component.scss'
})
export class ProfileTaskComponent {
  task!: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTasksById(id).subscribe((task) => {
        this.task = task;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
