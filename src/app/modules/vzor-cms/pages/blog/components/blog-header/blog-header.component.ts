import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-blog-header]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './blog-header.component.html',
  styleUrl: './blog-header.component.scss'
})
export class BlogHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  onCheckChange(event: any) {
    this.onCheck.emit(event.target.checked);
  }
}