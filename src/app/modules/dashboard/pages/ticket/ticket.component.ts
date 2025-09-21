import { Component, computed, signal } from '@angular/core';
import { TicketActionComponent } from '../../components/ticket/ticket-action/ticket-action.component';
import { TicketFooterComponent } from '../../components/ticket/ticket-footer/ticket-footer.component';
import { TicketHeaderComponent } from '../../components/ticket/ticket-header/ticket-header.component';
import { TicketRowComponent } from '../../components/ticket/ticket-row/ticket-row.component';
import { Ticket } from '../../models/ticket';
import { TicketFilterService } from '../../service/ticket-filter.service';
import { TicketService } from '../../service/ticket.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { AddTicketModalComponent } from '../../components/ticket/add-ticket-modal/add-ticket-modal.component';
import { ModalComponent } from '../../components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    TicketActionComponent,
    TicketFooterComponent,
    TicketHeaderComponent,
    TicketRowComponent,
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    AddTicketModalComponent,
    ModalComponent
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

  tickets = signal<Ticket[]>([]);
  isModalOpen = false;
  selectedTicket!: Ticket;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;

  constructor(
    private filterService: TicketFilterService,
    private ticketService: TicketService,
  ) {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe({
      next: (tickets: Ticket[]) => {
        this.tickets.update(() => tickets);
      },
      error: (error) => {
        this.handleRequestError(error);
      }
    });
  }

  toggleTickets(checked: boolean) {
    this.tickets.update((tickets) =>
      tickets.map((ticket) => ({ ...ticket, selected: checked }))
    );
  }

  handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener los tickets. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
      action: {
        label: 'Deshacer',
        onClick: () => console.log('¡Acción deshecha!'),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }

  filteredTickets = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const priority = this.filterService.priorityField();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();
  
    // Filtrar por búsqueda
    const filteredBySearch = this.tickets().filter((ticket) => {
      const matchesSearch = (ticket.titulo?.toLowerCase() || '').includes(search) ||
                            (ticket.usuarioSolicitante?.toLowerCase() || '').includes(search) ||
                            (ticket.asignadoA?.toLowerCase() || '').includes(search);
      return matchesSearch;
    });
  
    // Filtrar por prioridad
    const filteredByPriority = filteredBySearch.filter((ticket: Ticket) => {
      const matchesPriority = !priority || ticket.prioridad?.toLowerCase() === priority.toLowerCase();
      return matchesPriority;
    });
  
    // Filtrar por estado
    const filteredByStatus = filteredByPriority.filter((ticket: Ticket) => {
      let matchesStatus = true;
      if (status) {
        switch (status) {
          case 'Abierto':
            matchesStatus = ticket.estado === 'Abierto';
            break;
          case 'En Proceso':
            matchesStatus = ticket.estado === 'En Proceso';
            break;
          case 'Cerrado':
            matchesStatus = ticket.estado === 'Cerrado';
            break;
          default:
            matchesStatus = true;
            break;
        }
      }
      return matchesStatus;
    });
  
    // Ordenar los tickets
    const sortedByDate = filteredByStatus.sort((a, b) => {
      const defaultNewest = !order || order === '1';
      const dateA = new Date(a.fechaCreacion);
      const dateB = new Date(b.fechaCreacion);
  
      if (defaultNewest) {
        return dateB.getTime() - dateA.getTime();
      } else if (order === '2') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === '3') {
        // Mayor prioridad
        return a.prioridad.localeCompare(b.prioridad);
      } else if (order === '4') {
        // Menor prioridad
        return b.prioridad.localeCompare(a.prioridad);
      }
      return 0;
    });
  
    return sortedByDate;
  });  

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTicket = {} as Ticket;
  }

  openEditModal(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.openModal();
  }

  openExportConfirmation(exportType: 'pdf' | 'csv') {
    this.isExporting = exportType;
    this.isModalOpenExport = true;
  }

  // Handle export after confirmation
  handleExportConfirmation(exportType: 'pdf' | 'csv') {
    if (exportType === 'pdf') {
      this.exportToPDF();
    } else if (exportType === 'csv') {
      this.exportToCSV();
    }
    this.isModalOpenExport = false;
  }

  exportToPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Título', 'Solicitante', 'Asignado A', 'Estado', 'Prioridad']],
      body: this.filteredTickets().map(ticket => [
        ticket.titulo || '', 
        ticket.usuarioSolicitante || '', 
        ticket.asignadoA || '', 
        ticket.estado || '', 
        ticket.prioridad || ''
      ])
    });
    doc.save('tickets.pdf');
  }

  exportToCSV() {
    const headers = 'Título,Solicitante,Asignado A,Estado,Prioridad\n';
    const rows = this.filteredTickets().map(ticket => [
      ticket.titulo, ticket.usuarioSolicitante, ticket.asignadoA, ticket.estado, ticket.prioridad
    ].join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tickets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
