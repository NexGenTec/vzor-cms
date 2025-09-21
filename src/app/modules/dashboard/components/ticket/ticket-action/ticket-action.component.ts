import { Component } from '@angular/core';
import { TicketFilterService } from '../../../service/ticket-filter.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TicketService } from '../../../service/ticket.service';
import { Ticket } from '../../../models/ticket';

@Component({
  selector: 'app-ticket-action',
  standalone: true,
  imports: [AngularSvgIconModule,CommonModule],
  templateUrl: './ticket-action.component.html',
  styleUrl: './ticket-action.component.scss'
})
export class TicketActionComponent {
  ticket: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  

  constructor(
    public ticketService: TicketFilterService,
   private ticktService:TicketService) {}

  ngOnInit() {
    this.ticktService.getTickets().subscribe(tickets => {
      this.ticket = tickets;
      this.filteredTickets = tickets;
    });
  }

  onSearchChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.ticketService.searchField.set(input.value);
  }

  onPriorityChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.ticketService.priorityField.set(selectElement.value);
  }
  

  onStatusChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.ticketService.statusField.set(selectElement.value);
  }

  onOrderChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.ticketService.orderField.set(selectElement.value);
  }

}