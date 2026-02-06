import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { TicketService } from '../../../service/ticket.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';

@Component({
  selector: '[app-ticket-row]',
  standalone: true,
  imports: [AngularSvgIconModule,FormsModule,CommonModule],
  templateUrl: './ticket-row.component.html',
  styleUrl: './ticket-row.component.scss'
})
export class TicketRowComponent {
  @Input() ticket: Ticket = {} as Ticket;
  @Input() onEditTicket: (ticket: Ticket) => void = () => {};
  @Output() selectedChange = new EventEmitter<boolean>();

  // Estado del modal
  isDeleteModalOpen: boolean = false;
  ticketToDeleteId: string = ''; // Almacena el id del ticket a eliminar

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  toggleSelection() {
    this.ticket.selected = !this.ticket.selected;
    this.selectedChange.emit(this.ticket.selected);
  }

  editTicket(ticket: Ticket) {
    console.log('Editando ticket:', ticket);
    this.onEditTicket(ticket);
  }

  // Abre el modal de eliminación
  openDeleteModal(ticketId: string) {
    this.isDeleteModalOpen = true;
    this.ticketToDeleteId = ticketId;
  }

  // Cierra el modal de eliminación
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.ticketToDeleteId = '';
  }

  // Confirma la eliminación del ticket
  confirmDelete() {
    if (this.ticketToDeleteId) {
      this.deleteTicket(this.ticketToDeleteId);
      this.closeDeleteModal();
    }
  }

  // Elimina el ticket
  deleteTicket(id: string) {
    this.ticketService.deleteTicket(id).then(() => {
      toast.success('Ticket eliminado correctamente', {
        position: 'top-right',
        description: 'El ticket ha sido eliminado con éxito.',
        action: {
          label: 'Deshacer',
          onClick: () => console.log('¡Acción deshecha!'),
        },
        actionButtonStyle: 'background-color:#DC2626; color:white;',
      });
    }).catch((error) => {
      console.error('Error al eliminar el ticket:', error);
      toast.error('Error al eliminar el ticket', {
        position: 'top-right',
        description: error.message || 'No se pudo eliminar el ticket.',
      });
    });
  }

  shareOnWhatsApp(ticket: Ticket) {
    // Limitar la descripción a 200 caracteres para evitar mensajes muy largos
    const descripcionCorta = ticket.descripcion.length > 200 
      ? ticket.descripcion.substring(0, 200) + "..." 
      : ticket.descripcion;
  
    const message = `🎫 *Nuevo Ticket de Soporte*  
    ━━━━━━━━━━━━━━━━━━  
    📌 *Título:* _${ticket.titulo}_  
    📖 *Descripción:* _${descripcionCorta}_  
    📂 *Categoría:* _${ticket.categoria || 'No disponible'}_  
    📌 *Estado:* _${ticket.estado}_  
    ⚡ *Prioridad:* _${ticket.prioridad}_  
    👤 *Solicitante:* _${ticket.usuarioSolicitante}_  
    📅 *Fecha:* _${ticket.fechaCreacion ? new Date(ticket.fechaCreacion).toLocaleDateString() : 'Sin fecha'}_  
    ━━━━━━━━━━━━━━━━━━  
    📢 _Por favor, revise y atienda este ticket lo antes posible._  
    💻 *Enviado desde la plataforma vzor-cms*`;
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  viewTicket(ticketId: string) {
    this.router.navigate(['/layout/dashboard/ticket', ticketId]);
  }
  
}
