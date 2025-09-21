import { CommonModule, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { CalendarAddComponent } from '../calendar-add/calendar-add.component';
import { CalendarEvent } from '../../../models/calendar';

registerLocaleData(localeEs); 

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  imports: [CommonModule,CalendarAddComponent],
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.scss'
})
export class CalendarHeaderComponent {
  currentDate: Date = new Date();
  isModalOpen = false;
  events: CalendarEvent[] = [];

  navigateMonth(step: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + step);
  }

  goToToday() {
    this.currentDate = new Date();
  }

  selectView(view: string) {
    console.log(`Vista seleccionada: ${view}`);
  }

  addEvent() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onAddEvent(newEvent: CalendarEvent) {
    this.events.push(newEvent);
    console.log('Nuevo evento agregado:', newEvent);
  }

}
