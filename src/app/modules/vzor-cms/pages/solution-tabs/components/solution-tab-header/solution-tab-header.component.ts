import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-solution-tab-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-tab-header.component.html',
  styleUrl: './solution-tab-header.component.scss'
})
export class SolutionTabHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  onCheckChange(event: any): void {
    this.onCheck.emit(event.target.checked);
  }
}


