import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions } from '../../../../../shared/models/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../../models/ticket';
import { TicketService } from '../../../service/ticket.service';
import { TicketStateService } from '../../../service/ticket-state.service';

@Component({
  selector: '[nft-chart-card]',
  templateUrl: './nft-chart-card.component.html',
  standalone: true,
  imports: [AngularSvgIconModule, NgApexchartsModule,FormsModule,CommonModule],
})
export class NftChartCardComponent implements OnInit, OnDestroy {
  public chartOptions: Partial<ChartOptions>;
  ticketCountByStatus: { estado: string; cantidad: number }[] = [];
  totalTickets: number = 0;

  constructor(
    private ticketService: TicketService,
    private ticketStateService: TicketStateService
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#6c757d',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Cantidad',
        },
        labels: {
          style: {
            colors: '#6c757d',
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#007bff'],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' Tickets';
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.loadTickets();
    this.updateChartColor();
  }
  

  ngOnDestroy(): void {}

  updateChartColor(): void {
    const primaryColor = this.getPrimaryColor();
  
    this.chartOptions = {
      ...this.chartOptions,
      fill: {
        opacity: 1,
        colors: [primaryColor],
      },
      stroke: {
        colors: [primaryColor],
      },
    };
  
    const chart = document.querySelector('#chart') as HTMLElement;
    if (chart) {
      ApexCharts.exec('chart', 'updateOptions', {
        fill: { colors: [primaryColor] },
        stroke: { colors: [primaryColor] },
      });
    }
  }

  loadTickets() {
    if (this.ticketStateService.getTickets().length === 0) {
      // Fetch tickets if not loaded
      this.ticketService.getTickets().subscribe({
        next: (tickets: Ticket[]) => {
          console.log('Tickets recibidos:', tickets);
          this.ticketStateService.setTickets(tickets);
          this.updateChart(tickets);
        },
        error: (error) => {
          this.handleRequestError(error);
        },
      });
    } else {
      // Use the tickets from the service
      const tickets = this.ticketStateService.getTickets();
      this.updateChart(tickets);
    }
  }

  updateChart(tickets: Ticket[]) {
    this.ticketCountByStatus = this.getTicketCountByStatus(tickets);
  
    const data = this.ticketCountByStatus.map(item => item.cantidad);
    const categories = this.ticketCountByStatus.map(item => item.estado);
  
    this.totalTickets = data.reduce((sum, cantidad) => sum + cantidad, 0); // Calcular el total de tickets
  
    this.chartOptions = {
      ...this.chartOptions,
      series: [{ name: 'Tickets', data: data }],
      xaxis: { categories: categories },
    };
  }  

  getTicketCountByStatus(tickets: Ticket[]): { estado: string; cantidad: number }[] {

    const estados = ['Abierto', 'En Proceso', 'Cerrado'];

    return estados.map(estado => {
      const cantidad = tickets.filter(ticket => ticket.estado === estado).length;
      return { estado, cantidad };
    });
  }

  handleRequestError(error: any) {
    console.error('Error al cargar los tickets', error);
  }

  getPrimaryColor(): string {
    const tempElement = document.createElement('div');
    tempElement.className = 'text-primary';
    document.body.appendChild(tempElement);
  
    const color = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
  
    return color;
  }
  
}