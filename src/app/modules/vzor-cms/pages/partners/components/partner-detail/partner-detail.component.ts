import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from '../../../../services/partner.service';
import { Partner } from '../../../../models/partner.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-partner-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './partner-detail.component.html',
    styleUrl: './partner-detail.component.scss'
})
export class PartnerDetailComponent implements OnInit {
    partner: Partner | undefined;
    isLoading = true;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private partnerService = inject(PartnerService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadPartner(id);
        } else {
            this.router.navigate(['/layout/vzor-cms/partners']);
        }
    }

    private loadPartner(id: string): void {
        this.partnerService.getPartnerById(id).subscribe({
            next: (partner: Partner | undefined) => {
                this.partner = partner;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error(error);
                toast.error('Error al cargar el socio');
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/partners']);
    }

    editPartner(): void {
        if (this.partner) {
            this.router.navigate(['/layout/vzor-cms/partners/edit', this.partner.id]);
        }
    }
}
