import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-task-header]',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './task-header.component.html',
  styleUrl: './task-header.component.scss'
})
export class TaskHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  public toggle(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.onCheck.emit(value);
  }

}
