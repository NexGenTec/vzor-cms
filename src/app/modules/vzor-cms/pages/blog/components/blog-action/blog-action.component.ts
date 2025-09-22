import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-action.component.html',
  styleUrl: './blog-action.component.scss'
})
export class BlogActionComponent {
  @Input() totalPosts = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  onSearchChange(event: any) {
    this.searchChange.emit(event.target.value);
  }

  onCategoryChange(event: any) {
    this.categoryChange.emit(event.target.value);
  }

  onStatusChange(event: any) {
    this.statusChange.emit(event.target.value);
  }
}