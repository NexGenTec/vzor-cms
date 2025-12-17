import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SolutionService } from '../../services/solution.service';
import { SolutionFilterService } from '../../services/solution-filter.service';
import { SolutionItem, CreateSolutionItemRequest } from '../../models/solution.model';
import { SolutionHeaderComponent } from './components/solution-header/solution-header.component';
import { SolutionRowComponent } from './components/solution-row/solution-row.component';
import { SolutionActionComponent } from './components/solution-action/solution-action.component';
import { SolutionFooterComponent } from './components/solution-footer/solution-footer.component';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    SolutionHeaderComponent,
    SolutionRowComponent,
    SolutionActionComponent,
    SolutionFooterComponent,
  ],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent implements OnInit {
  solutions = signal<SolutionItem[]>([]);
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalSolutions = 0;
  private hasSeededDefaults = false;

  constructor(
    private solutionService: SolutionService,
    private filterService: SolutionFilterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSolutions();
  }

  loadSolutions(): void {
    this.isLoading = true;
    this.solutionService.getSolutions().subscribe({
      next: (solutions) => {
        this.solutions.set(solutions);
        this.totalSolutions = solutions.length;
        this.isLoading = false;

        // Si no hay soluciones creadas aún, inicializar con las soluciones base
        if (solutions.length === 0 && !this.hasSeededDefaults) {
          this.seedDefaultSolutions();
        }
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoading = false;
      }
    });
  }

  pagedSolutions = computed(() => {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredSolutions().slice(startIndex, endIndex);
  });

  filteredSolutions = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const status = this.filterService.statusField();

    return this.solutions().filter((solution) => {
      const matchesSearch =
        solution.name.toLowerCase().includes(search) ||
        solution.sectionTitle.toLowerCase().includes(search) ||
        solution.shortDescription.toLowerCase().includes(search);

      const matchesStatus = status === 'Todas' ||
        (status === 'Publicadas' && solution.isPublished) ||
        (status === 'Borradores' && !solution.isPublished);

      return matchesSearch && matchesStatus;
    });
  });

  selectedSolutions = signal<SolutionItem[]>([]);

  changePage(page: number): void {
    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  openModal(): void {
    this.router.navigate(['/layout/vzor-cms/solutions/new']);
  }

  openEditModal(solution: SolutionItem): void {
    this.router.navigate(['/layout/vzor-cms/solutions/edit', solution.id]);
  }

  viewSolution(solution: SolutionItem): void {
    this.router.navigate(['/layout/vzor-cms/solutions', solution.id]);
  }

  deleteSolution(id: string): void {
    this.solutionService.deleteSolution(id).subscribe({
      next: () => {
        toast.success('Solución eliminada exitosamente!');
        this.loadSolutions();
      },
      error: (error) => this.handleRequestError(error)
    });
  }

  toggleSolutions(checked: boolean): void {
    if (checked) {
      this.selectedSolutions.set([...this.filteredSolutions()]);
    } else {
      this.selectedSolutions.set([]);
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

  /**
   * Crea automáticamente las soluciones base según la estructura compartida:
   * Brain Monitor, Apps Monitor, Business Monitor, Stress Monitor, Infra Monitor, APM.
   */
  private seedDefaultSolutions(): void {
    this.hasSeededDefaults = true;

    const defaults: CreateSolutionItemRequest[] = [
      {
        name: 'VZOR®️ Brain Monitor',
        sectionTitle: 'VZOR®️ Brain Monitor',
        subtitle: 'Inteligencia Operacional con IA',
        shortDescription:
          'Anticipa fallas antes de que ocurran con inteligencia artificial. Detecta comportamientos anómalos y pronostica incidentes críticos con modelos de aprendizaje profundo entrenados sobre tus propios datos.',
        imgKey: 'brainMonitorHero',
        order: 1,
        isPublished: true,
      },
      {
        name: 'VZOR®️ Apps Monitor',
        sectionTitle: 'VZOR®️ Apps Monitor',
        subtitle: 'Monitoreo sintético de Aplicaciones Web & Android',
        shortDescription:
          'Monitorea el estado, rendimiento y disponibilidad de tus aplicaciones web, Android, microservicios y legados. Asegura la continuidad digital con visibilidad total de la experiencia de tus usuarios.',
        imgKey: 'appsMonitor',
        order: 2,
        isPublished: true,
      },
      {
        name: 'VZOR®️ Business Monitor',
        sectionTitle: 'VZOR®️ Business Monitor',
        subtitle:
          'Supervisa los procesos de negocio mediante KPIs, dashboards y alertas visuales, conectando métricas operacionales con el desempeño corporativo.',
        shortDescription:
          'Supervisa los procesos de negocio mediante KPIs, dashboards y alertas visuales, conectando métricas operacionales con el desempeño corporativo.',
        imgKey: 'busMonitor',
        order: 3,
        isPublished: true,
      },
      {
        name: 'VZOR®️ Stress Monitor',
        sectionTitle: 'VZOR®️ Stress Monitor',
        subtitle: 'Pruebas de stress para tus canales digitales web y Android',
        shortDescription:
          'Pruebas de stress para tus canales digitales web y Android, permitiendo validar capacidad, resiliencia y experiencia de usuario bajo alta demanda.',
        imgKey: 'stressMonitor',
        order: 4,
        isPublished: true,
      },
      {
        name: 'VZOR®️ Infra Monitor',
        sectionTitle: 'VZOR®️ Infra Monitor',
        subtitle:
          'Supervisa en tiempo real toda la infraestructura TI - OT - IoT, sin uso de agentes, utilizando múltiples protocolos nativos.',
        shortDescription:
          'Supervisa en tiempo real toda la infraestructura TI - OT - IoT, sin uso de agentes, utilizando múltiples protocolos nativos.',
        imgKey: 'infraMonitor',
        order: 5,
        isPublished: true,
      },
      {
        name: 'VZOR®️ APM',
        sectionTitle: 'VZOR®️ APM',
        subtitle:
          'Observabilidad transaccional profunda mediante trazas distribuidas para identificar cuellos de botella y errores.',
        shortDescription:
          'Proporciona observabilidad transaccional profunda mediante trazas distribuidas para identificar cuellos de botella y errores a nivel de aplicación o código.',
        imgKey: 'apm',
        order: 6,
        isPublished: true,
      },
    ];

    defaults.forEach((solution) => {
      this.solutionService.createSolution(solution).subscribe({
        next: () => {
          // La lista se recargará automáticamente por el onSnapshot de Firestore.
        },
        error: (error) => {
          this.handleRequestError(error);
        },
      });
    });
  }
}


