import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { PartnerService } from '../../services/partner.service';
import { PartnerFilterService } from '../../services/partner-filter.service';
import { Partner } from '../../models/partner.model';
import { PartnerHeaderComponent } from './components/partner-header/partner-header.component';
import { PartnerRowComponent } from './components/partner-row/partner-row.component';
import { PartnerActionComponent } from './components/partner-action/partner-action.component';
import { PartnerFooterComponent } from './components/partner-footer/partner-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';

@Component({
    selector: 'app-partners',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        PartnerHeaderComponent,
        PartnerRowComponent,
        PartnerActionComponent,
        PartnerFooterComponent,
        ModalComponent
    ],
    templateUrl: './partners.component.html',
    styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit {
    partners = signal<Partner[]>([]);
    isLoading = false;
    currentPage = 1;
    pageSize = 10;
    totalPartners = 0;

    constructor(
        private partnerService: PartnerService,
        private filterService: PartnerFilterService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadPartners();
    }

    loadPartners(): void {
        this.isLoading = true;
        this.partnerService.getPartners().subscribe({
            next: (partners) => {
                this.partners.set(partners);
                this.totalPartners = partners.length;
                this.isLoading = false;
            },
            error: (error) => {
                this.handleRequestError(error);
                this.isLoading = false;
            }
        });
    }

    pagedPartners = computed(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredPartners().slice(startIndex, endIndex);
    });

    filteredPartners = computed(() => {
        const search = this.filterService.searchField().toLowerCase();
        const status = this.filterService.statusField();

        return this.partners().filter((partner) => {
            const matchesSearch =
                partner.name.toLowerCase().includes(search) ||
                partner.description.toLowerCase().includes(search);

            const matchesStatus = status === 'Todas' ||
                (status === 'Visibles' && partner.isVisible) ||
                (status === 'Ocultos' && !partner.isVisible);

            return matchesSearch && matchesStatus;
        });
    });

    selectedPartners = signal<Partner[]>([]);

    changePage(page: number): void {
        this.currentPage = page;
    }

    changePageSize(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
    }

    openModal(): void {
        this.router.navigate(['/layout/vzor-cms/partners/new']);
    }

    openEditModal(partner: Partner): void {
        this.router.navigate(['/layout/vzor-cms/partners/edit', partner.id]);
    }

    viewPartner(partner: Partner): void {
        this.router.navigate(['/layout/vzor-cms/partners', partner.id]);
    }

    deletePartner(id: string): void {
        this.partnerService.deletePartner(id).subscribe({
            next: () => {
                toast.success('Socio eliminado exitosamente!');
                this.loadPartners();
            },
            error: (error) => this.handleRequestError(error)
        });
    }

    togglePartners(checked: boolean): void {
        if (checked) {
            this.selectedPartners.set([...this.filteredPartners()]);
        } else {
            this.selectedPartners.set([]);
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
