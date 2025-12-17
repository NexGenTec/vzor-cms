import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolutionTab } from '../../../../models/solution-tab.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: '[app-solution-tab-row]',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './solution-tab-row.component.html',
  styleUrl: './solution-tab-row.component.scss'
})
export class SolutionTabRowComponent {
  @Input() tab!: SolutionTab;
  @Output() editTab = new EventEmitter<SolutionTab>();
  @Output() deleteTab = new EventEmitter<string>();
  @Output() viewTab = new EventEmitter<SolutionTab>();

  showDeleteModal = false;

  onEdit(): void {
    this.editTab.emit(this.tab);
  }

  onView(): void {
    this.viewTab.emit(this.tab);
  }

  onDelete(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.deleteTab.emit(this.tab.id);
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


