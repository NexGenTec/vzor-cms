import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-ticket-footer',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './ticket-footer.component.html',
  styleUrl: './ticket-footer.component.scss'
})
export class TicketFooterComponent {

}
