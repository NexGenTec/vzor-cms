import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketStateService {
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketSubject.asObservable();

  constructor() {}

  setTickets(tickets: Ticket[]) {
    this.ticketSubject.next(tickets);
  }

  getTickets() {
    return this.ticketSubject.value;
  }
}
