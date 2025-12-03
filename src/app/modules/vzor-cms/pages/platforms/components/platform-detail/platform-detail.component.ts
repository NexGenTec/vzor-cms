import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformService } from '../../../../services/platform.service';
import { Platform } from '../../../../models/platform.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-platform-detail',
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule],
    templateUrl: './platform-detail.component.html',
    styleUrl: './platform-detail.component.scss'
})
export class PlatformDetailComponent implements OnInit {
    platform: Platform | undefined;
    isLoading = true;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private platformService = inject(PlatformService);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadPlatform(id);
        } else {
            this.router.navigate(['/layout/vzor-cms/platforms']);
        }
    }

    private loadPlatform(id: string): void {
        this.platformService.getPlatformById(id).subscribe({
            next: (platform: Platform | undefined) => {
                this.platform = platform;
                this.isLoading = false;
            },
            error: (error: any) => {
                console.error(error);
                toast.error('Error al cargar la plataforma');
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/layout/vzor-cms/platforms']);
    }

    editPlatform(): void {
        if (this.platform) {
            this.router.navigate(['/layout/vzor-cms/platforms/edit', this.platform.id]);
        }
    }
}
