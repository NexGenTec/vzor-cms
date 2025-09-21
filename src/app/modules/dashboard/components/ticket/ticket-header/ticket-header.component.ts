import { Component, EventEmitter, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-ticket-header]',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './ticket-header.component.html',
  styleUrl: './ticket-header.component.scss'
})
export class TicketHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();

  public toggle(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.onCheck.emit(value);
  }

}
