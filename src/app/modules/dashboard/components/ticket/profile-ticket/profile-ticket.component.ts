import { Component } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../service/ticket.service';
import { CommonModule, Location, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-profile-ticket',
  standalone: true,
  imports: [AngularSvgIconModule, FormsModule, CommonModule,NgClass],
  templateUrl: './profile-ticket.component.html',
  styleUrl: './profile-ticket.component.scss'
})
export class ProfileTicketComponent {
  ticket!: Ticket | undefined;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketService.getTicketById(id).subscribe((ticket) => {
        this.ticket = ticket;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
