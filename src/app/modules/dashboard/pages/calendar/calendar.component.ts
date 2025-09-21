import { Component } from '@angular/core';
import { CalendarHeaderComponent } from '../../components/calendar/calendar-header/calendar-header.component';
import { CalendarActionComponent } from '../../components/calendar/calendar-action/calendar-action.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarHeaderComponent,CalendarActionComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

}
