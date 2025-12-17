import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-solution-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-header.component.html',
  styleUrl: './solution-header.component.scss'
})
export class SolutionHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  onCheckChange(event: any): void {
    this.onCheck.emit(event.target.checked);
  }
}


