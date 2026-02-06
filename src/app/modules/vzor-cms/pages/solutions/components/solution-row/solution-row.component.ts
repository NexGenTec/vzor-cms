import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolutionItem } from '../../../../models/solution.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: '[app-solution-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './solution-row.component.html',
  styleUrl: './solution-row.component.scss'
})
export class SolutionRowComponent {
  @Input() solution!: SolutionItem;
  @Output() editSolution = new EventEmitter<SolutionItem>();
  @Output() deleteSolution = new EventEmitter<string>();
  @Output() viewSolution = new EventEmitter<SolutionItem>();

  showDeleteModal = false;

  onEdit(): void {
    this.editSolution.emit(this.solution);
  }

  onView(): void {
    this.viewSolution.emit(this.solution);
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.deleteSolution.emit(this.solution.id);
    this.showDeleteModal = false;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  getFormattedDate(date: any): Date | null {
    if (!date) return null;
    try {
      if (date instanceof Date) return date;
      if (date && typeof date === 'object' && date.toDate) return date.toDate();
      if (date && typeof date === 'object' && date.seconds) return new Date(date.seconds * 1000);
      if (typeof date === 'string' || typeof date === 'number') return new Date(date);
      return null;
    } catch {
      return null;
    }
  }
}


