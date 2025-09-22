import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-review-clientes-header]',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './review-clientes-header.component.html',
  styleUrl: './review-clientes-header.component.scss'
})
export class ReviewClientesHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  onCheckChange(event: any) {
    this.onCheck.emit(event.target.checked);
  }
}