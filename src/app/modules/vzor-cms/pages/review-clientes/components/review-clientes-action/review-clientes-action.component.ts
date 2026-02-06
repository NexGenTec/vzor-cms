import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-clientes-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-clientes-action.component.html',
  styleUrl: './review-clientes-action.component.scss'
})
export class ReviewClientesActionComponent {
  @Input() totalReviews = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() projectTypeChange = new EventEmitter<string>();
  @Output() ratingChange = new EventEmitter<string>();

  onSearchChange(event: any) {
    this.searchChange.emit(event.target.value);
  }

  onProjectTypeChange(event: any) {
    this.projectTypeChange.emit(event.target.value);
  }

  onRatingChange(event: any) {
    this.ratingChange.emit(event.target.value);
  }
}