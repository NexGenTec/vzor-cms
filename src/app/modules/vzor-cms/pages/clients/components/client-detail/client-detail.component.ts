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
}
