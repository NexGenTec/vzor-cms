import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SolutionService } from '../../../../services/solution.service';
import { SolutionItem } from '../../../../models/solution.model';

@Component({
  selector: 'app-solution-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution-detail.component.html',
  styleUrl: './solution-detail.component.scss'
})
export class SolutionDetailComponent implements OnInit {
  solution: SolutionItem | undefined;
  isLoading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solutionService = inject(SolutionService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSolution(id);
    } else {
      this.router.navigate(['/layout/vzor-cms/solutions']);
    }
  }

  private loadSolution(id: string): void {
    this.solutionService.getSolutionById(id).subscribe({
      next: (solution: SolutionItem | undefined) => {
        this.solution = solution;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error(error);
        toast.error('Error al cargar la solución');
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/layout/vzor-cms/solutions']);
  }

  editSolution(): void {
    if (this.solution) {
      this.router.navigate(['/layout/vzor-cms/solutions/edit', this.solution.id]);
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


