import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-detail.component.html',
    styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
    client: Client | undefined;
    isLoading = true;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private clientService = inject(ClientService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadClient(id);
        } else {
            this.router.navigate(['/layout/vzor-cms/clients']);
        }
    }

    private loadClient(id: string): void {
        this.clientService.getClientById(id).subscribe({
            next: (client: Client | undefined) => {
                this.client = client;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error(error);
                toast.error('Error al cargar el cliente');
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/clients']);
    }

    editClient(): void {
        if (this.client) {
            this.router.navigate(['/layout/vzor-cms/clients/edit', this.client.id]);
        }
    }

    getFormattedDate(date: any): Date | null {
        if (!date) return null;
        try {
            if (date instanceof Date) return date;
            if (date && typeof date === 'object' && date.toDate) return date.toDate();
            if (date && typeof date === 'object' && date.seconds) return new Date(date.seconds * 1000);
            if (typeof date === 'string' || typeof date === 'number') return new Date(date);
            return null;
        } catch (error) {
            return null;
        }
    }
}
