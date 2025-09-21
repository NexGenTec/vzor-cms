import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarEvent } from '../../../models/calendar';
import { toast } from 'ngx-sonner';
import { CalendarService } from '../../../service/calendar.service';

@Component({
  selector: 'app-calendar-add',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './calendar-add.component.html',
  styleUrl: './calendar-add.component.scss'
})
export class CalendarAddComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() addEvent = new EventEmitter<CalendarEvent>();
  selectedColor!: string; 
  colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#9B59B6', '#1ABC9C'];
  dropdownOpen = false;
  
  event: CalendarEvent = {
    titulo: '',
    descripcion: '',
    fecha: new Date(),
    hora: '',
    ubicacion: '',
    tipo: 'Reunión',
    esRecurrente: false,
    colorEtiqueta: '#FF5733'
  };
  
  constructor(private calendarService: CalendarService) { }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectColor(color: string) {
    this.event.colorEtiqueta = color;
    this.dropdownOpen = false;
  }
  
  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.event.titulo && this.event.fecha && this.event.hora) {
      if (typeof this.event.fecha === 'string') {
        this.event.fecha = new Date(this.event.fecha);
      }
      this.calendarService.createEvent(this.event).then(() => {
        this.addEvent.emit(this.event);
        this.close();
        console.log('Evento creado:', this.event);
        toast.success('Evento creado correctamente', {
          position: 'top-right',
          description: 'El evento ha sido creado con éxito.',
        });
      }).catch(error => {
        toast.error('Error al crear el evento', {
          position: 'top-right',
          description: error.message,
        });
      });
    } else {
      toast.error('Error al crear el evento', {
        position: 'top-right',
        description: 'Por favor, completa todos los campos necesarios.',
      });
    }
  }  

}