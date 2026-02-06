import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-action.component.html',
  styleUrl: './solution-action.component.scss'
})
export class SolutionActionComponent {
  @Input() totalSolutions = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  onSearchChange(event: any): void {
    this.searchChange.emit(event.target.value);
  }

  onStatusChange(event: any): void {
    this.statusChange.emit(event.target.value);
  }
}


