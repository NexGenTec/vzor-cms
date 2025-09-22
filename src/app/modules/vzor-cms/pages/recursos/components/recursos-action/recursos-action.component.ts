import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recursos-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recursos-action.component.html',
  styleUrl: './recursos-action.component.scss'
})
export class RecursosActionComponent {
  @Input() totalRecursos = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  onSearchChange(event: any) {
    this.searchChange.emit(event.target.value);
  }

  onCategoryChange(event: any) {
    this.categoryChange.emit(event.target.value);
  }
}