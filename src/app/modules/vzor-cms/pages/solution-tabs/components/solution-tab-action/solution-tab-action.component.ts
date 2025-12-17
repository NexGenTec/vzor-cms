import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution-tab-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-tab-action.component.html',
  styleUrl: './solution-tab-action.component.scss'
})
export class SolutionTabActionComponent {
  @Input() totalSolutionTabs = 0;
  @Output() searchChange = new EventEmitter<string>();

  onSearchChange(event: any): void {
    this.searchChange.emit(event.target.value);
  }
}


