import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: '[app-team-header]',
  standalone: true,
  imports: [],
  templateUrl: './team-header.component.html',
  styleUrl: './team-header.component.scss'
})
export class TeamHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();
  @Input() allSelected: boolean = false;

  toggleAllTeams(event: any) {
    const checked = event.target.checked;
    this.onCheck.emit(checked);
  }
} 