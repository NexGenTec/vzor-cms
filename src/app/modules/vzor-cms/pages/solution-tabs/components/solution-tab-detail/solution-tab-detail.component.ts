import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SolutionTabService } from '../../../../services/solution-tab.service';
import { SolutionTab } from '../../../../models/solution-tab.model';

@Component({
  selector: 'app-solution-tab-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-tab-detail.component.html',
  styleUrl: './solution-tab-detail.component.scss'
})
export class SolutionTabDetailComponent implements OnInit {
  tab: SolutionTab | undefined;
  isLoading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solutionTabService = inject(SolutionTabService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSolutionTab(id);
    } else {
      this.router.navigate(['/layout/vzor-cms/solution-tabs']);
    }
  }

  private loadSolutionTab(id: string): void {
    this.solutionTabService.getSolutionTabById(id).subscribe({
      next: (tab: SolutionTab | undefined) => {
        this.tab = tab;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
        toast.error('Error al cargar el tab de soluciones');
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/layout/vzor-cms/solution-tabs']);
  }

  editTab(): void {
    if (this.tab) {
      this.router.navigate(['/layout/vzor-cms/solution-tabs/edit', this.tab.id]);
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
    } catch {
      return null;
    }
  }
}


