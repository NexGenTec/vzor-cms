import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: '[app-project-header]',
  standalone: true,
  imports: [],
  templateUrl: './project-header.component.html',
  styleUrl: './project-header.component.scss'
})
export class ProjectHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();
  @Input() allSelected: boolean = false;

  toggleAllProjects(event: any) {
    const checked = event.target.checked;
    this.onCheck.emit(checked);
  }
}
