import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { ClientService } from '../../services/client.service';
import { ClientFilterService } from '../../services/client-filter.service';
import { Client } from '../../models/client.model';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { ClientRowComponent } from './components/client-row/client-row.component';
import { ClientActionComponent } from './components/client-action/client-action.component';
import { ClientFooterComponent } from './components/client-footer/client-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        ClientHeaderComponent,
        ClientRowComponent,
        ClientActionComponent,
        ClientFooterComponent,
        ModalComponent
    ],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
    clients = signal<Client[]>([]);
    isLoading = false;
    currentPage = 1;
    pageSize = 10;
    totalClients = 0;

    constructor(
        private clientService: ClientService,
        private filterService: ClientFilterService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients(): void {
        this.isLoading = true;
        this.clientService.getClients().subscribe({
            next: (clients) => {
                this.clients.set(clients);
                this.totalClients = clients.length;
                this.isLoading = false;
            },
            error: (error) => {
                this.handleRequestError(error);
                this.isLoading = false;
            }
        });
    }

    pagedClients = computed(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredClients().slice(startIndex, endIndex);
    });

    filteredClients = computed(() => {
        const search = this.filterService.searchField().toLowerCase();
        const status = this.filterService.statusField();

        return this.clients().filter((client) => {
            const matchesSearch =
                client.name.toLowerCase().includes(search) ||
                client.description.toLowerCase().includes(search) ||
                client.sector.toLowerCase().includes(search);

            const matchesStatus = status === 'Todas' ||
                (status === 'Publicados' && client.isPublished) ||
                (status === 'Borradores' && !client.isPublished);

            return matchesSearch && matchesStatus;
        });
    });

    selectedClients = signal<Client[]>([]);

    changePage(page: number): void {
        this.currentPage = page;
    }

    changePageSize(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
    }

    openModal(): void {
        this.router.navigate(['/layout/vzor-cms/clients/new']);
    }

    openEditModal(client: Client): void {
        this.router.navigate(['/layout/vzor-cms/clients/edit', client.id]);
    }

    viewClient(client: Client): void {
        this.router.navigate(['/layout/vzor-cms/clients', client.id]);
    }

    deleteClient(id: string): void {
        this.clientService.deleteClient(id).subscribe({
            next: () => {
                toast.success('Cliente eliminado exitosamente!');
                this.loadClients();
            },
            error: (error) => this.handleRequestError(error)
        });
    }

    toggleClients(checked: boolean): void {
        if (checked) {
            this.selectedClients.set([...this.filteredClients()]);
        } else {
            this.selectedClients.set([]);
        }
    }

    onSearchChange(searchTerm: string): void {
        this.filterService.searchField.set(searchTerm);
    }

    onStatusChange(status: string): void {
        this.filterService.statusField.set(status);
    }

    private handleRequestError(error: any): void {
        const msg = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
        toast.error(msg, {
            position: 'top-right',
            description: error.message,
        });
        console.error(error);
    }
}
