import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { PlatformService } from '../../services/platform.service';
import { PlatformFilterService } from '../../services/platform-filter.service';
import { Platform } from '../../models/platform.model';
import { PlatformHeaderComponent } from './components/platform-header/platform-header.component';
import { PlatformRowComponent } from './components/platform-row/platform-row.component';
import { PlatformActionComponent } from './components/platform-action/platform-action.component';
import { PlatformFooterComponent } from './components/platform-footer/platform-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';

@Component({
    selector: 'app-platforms',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        PlatformHeaderComponent,
        PlatformRowComponent,
        PlatformActionComponent,
        PlatformFooterComponent,
        ModalComponent
    ],
    templateUrl: './platforms.component.html',
    styleUrl: './platforms.component.scss'
})
export class PlatformsComponent implements OnInit {
    platforms = signal<Platform[]>([]);
    isLoading = false;
    currentPage = 1;
    pageSize = 10;
    totalPlatforms = 0;

    constructor(
        private platformService: PlatformService,
        private filterService: PlatformFilterService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadPlatforms();
    }

    loadPlatforms(): void {
        this.isLoading = true;
        this.platformService.getPlatforms().subscribe({
            next: (platforms) => {
                this.platforms.set(platforms);
                this.totalPlatforms = platforms.length;
                this.isLoading = false;
            },
            error: (error) => {
                this.handleRequestError(error);
                this.isLoading = false;
            }
        });
    }

    pagedPlatforms = computed(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredPlatforms().slice(startIndex, endIndex);
    });

    filteredPlatforms = computed(() => {
        const search = this.filterService.searchField().toLowerCase();
        const status = this.filterService.statusField();

        return this.platforms().filter((platform) => {
            const matchesSearch =
                platform.name.toLowerCase().includes(search) ||
                platform.description.toLowerCase().includes(search);

            const matchesStatus = status === 'Todas' ||
                (status === 'Activas' && platform.isActive) ||
                (status === 'Inactivas' && !platform.isActive);

            return matchesSearch && matchesStatus;
        });
    });

    selectedPlatforms = signal<Platform[]>([]);

    changePage(page: number): void {
        this.currentPage = page;
    }

    changePageSize(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
    }

    openModal(): void {
        this.router.navigate(['/layout/vzor-cms/platforms/new']);
    }

    openEditModal(platform: Platform): void {
        this.router.navigate(['/layout/vzor-cms/platforms/edit', platform.id]);
    }

    viewPlatform(platform: Platform): void {
        this.router.navigate(['/layout/vzor-cms/platforms', platform.id]);
    }

    deletePlatform(id: string): void {
        this.platformService.deletePlatform(id).subscribe({
            next: () => {
                toast.success('Plataforma eliminada exitosamente!');
                this.loadPlatforms();
            },
            error: (error) => this.handleRequestError(error)
        });
    }

    togglePlatforms(checked: boolean): void {
        if (checked) {
            this.selectedPlatforms.set([...this.filteredPlatforms()]);
        } else {
            this.selectedPlatforms.set([]);
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
