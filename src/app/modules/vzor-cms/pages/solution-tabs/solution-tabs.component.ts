import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { SolutionTabService } from '../../services/solution-tab.service';
import { SolutionTabFilterService } from '../../services/solution-tab-filter.service';
import { SolutionTab, SolutionTabSolution, CreateSolutionTabRequest } from '../../models/solution-tab.model';
import { SolutionTabHeaderComponent } from './components/solution-tab-header/solution-tab-header.component';
import { SolutionTabRowComponent } from './components/solution-tab-row/solution-tab-row.component';
import { SolutionTabActionComponent } from './components/solution-tab-action/solution-tab-action.component';
import { SolutionTabFooterComponent } from './components/solution-tab-footer/solution-tab-footer.component';

@Component({
  selector: 'app-solution-tabs',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    FormsModule,
    SolutionTabHeaderComponent,
    SolutionTabRowComponent,
    SolutionTabActionComponent,
    SolutionTabFooterComponent,
  ],
  templateUrl: './solution-tabs.component.html',
  styleUrl: './solution-tabs.component.scss'
})
export class SolutionTabsComponent implements OnInit {
  solutionTabs = signal<SolutionTab[]>([]);
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalSolutionTabs = 0;
  private hasSeededDefaults = false;

  constructor(
    private solutionTabService: SolutionTabService,
    private filterService: SolutionTabFilterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSolutionTabs();
  }

  loadSolutionTabs(): void {
    this.isLoading = true;
    this.solutionTabService.getSolutionTabs().subscribe({
      next: (tabs) => {
        this.solutionTabs.set(tabs);
        this.totalSolutionTabs = tabs.length;
        this.isLoading = false;

        // Si no existen tabs aún, crear los 3 tabs base según la estructura
        if (tabs.length === 0 && !this.hasSeededDefaults) {
          this.seedDefaultTabs();
        }
      },
      error: (error) => {
        this.handleRequestError(error);
        this.isLoading = false;
      }
    });
  }

  pagedSolutionTabs = computed(() => {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredSolutionTabs().slice(startIndex, endIndex);
  });

  filteredSolutionTabs = computed(() => {
    const search = this.filterService.searchField().toLowerCase();

    return this.solutionTabs().filter((tab) => {
      const matchesSearch =
        tab.id.toLowerCase().includes(search) ||
        tab.label.toLowerCase().includes(search) ||
        tab.contentTitle.toLowerCase().includes(search);

      return matchesSearch;
    });
  });

  selectedSolutionTabs = signal<SolutionTab[]>([]);

  changePage(page: number): void {
    this.currentPage = page;
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  openModal(): void {
    this.router.navigate(['/layout/vzor-cms/solution-tabs/new']);
  }

  openEditModal(tab: SolutionTab): void {
    this.router.navigate(['/layout/vzor-cms/solution-tabs/edit', tab.id]);
  }

  viewSolutionTab(tab: SolutionTab): void {
    this.router.navigate(['/layout/vzor-cms/solution-tabs', tab.id]);
  }

  deleteSolutionTab(id: string): void {
    this.solutionTabService.deleteSolutionTab(id).subscribe({
      next: () => {
        toast.success('Tab de solución eliminado exitosamente!');
        this.loadSolutionTabs();
      },
      error: (error) => this.handleRequestError(error)
    });
  }

  toggleSolutionTabs(checked: boolean): void {
    if (checked) {
      this.selectedSolutionTabs.set([...this.filteredSolutionTabs()]);
    } else {
      this.selectedSolutionTabs.set([]);
    }
  }

  onSearchChange(searchTerm: string): void {
    this.filterService.searchField.set(searchTerm);
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
   * Crea automáticamente los tabs base (suite360, aiops, itmgmt)
   * según la estructura que usas en la web pública.
   */
  private seedDefaultTabs(): void {
    this.hasSeededDefaults = true;

    const makeSolution = (
      id: number,
      title: string,
      desc: string,
      color: string,
      imgKey: string,
      href: string
    ): SolutionTabSolution => ({
      id,
      title,
      desc,
      color,
      imgKey,
      href,
    });

    const defaults: CreateSolutionTabRequest[] = [
      {
        id: 'suite360',
        label: 'VZOR®️ Suite 360°',
        href: '/plataforma/suite360',
        color: '#00B5E2',
        contentTitle:
          'Plataforma integral de Monitoreo y Observabilidad Full Stack para Infraestructura TI-OT, Aplicaciones y Procesos de Negocio.',
        contentText:
          'Integra en una sola plataforma la captura y análisis de datos operacionales y estratégicos, entregando visibilidad total, control inteligente y operación proactiva del ecosistema tecnológico.',
        solutions: [
          makeSolution(
            1,
            'VZOR®️ Infra Monitor',
            'Supervisa en tiempo real toda la infraestructura TI - OT - IoT, sin uso de agentes, utilizando múltiples protocolos nativos.',
            'bg-[var(--color-vzor-gray-100)]',
            'infraMonitor',
            'solutions/infra-monitor'
          ),
          makeSolution(
            2,
            'VZOR®️ Apps Monitor',
            'Simula usuarios reales para medir la experiencia digital en sitios web, aplicaciones móviles y APIs, detectando degradaciones antes de impactar al servicio.',
            'bg-[var(--color-vzor-blue-300)]/30',
            'appsMonitor',
            'solutions/apps-monitor'
          ),
          makeSolution(
            3,
            'VZOR®️ Business Monitor',
            'Supervisa los procesos de negocio mediante KPIs, dashboards y alertas visuales, conectando métricas operacionales con el desempeño corporativo.',
            'bg-[var(--color-vzor-blue-500)]/30',
            'busMonitor',
            'solutions/bussiness-monitor'
          ),
          makeSolution(
            4,
            'VZOR®️ Stress Monitor',
            'Pruebas de stress para tus canales digitales web y Android',
            'bg-[var(--color-vzor-blue-500)]/30',
            'stressMonitor',
            'solutions/stress-monitor'
          ),
          makeSolution(
            5,
            'VZOR®️ APM',
            'Proporciona observabilidad transaccional profunda mediante trazas distribuidas para identificar cuellos de botella y errores a nivel de aplicación o código.',
            'bg-[var(--color-vzor-blue-900)]/30',
            'apm',
            'solutions/apm'
          ),
        ],
      },
      {
        id: 'aiops',
        label: 'VZOR®️ Suite AIOps',
        href: '/plataforma/suiteaiops',
        color: '#2B7DE1',
        contentTitle: 'Plataforma de Automatización Inteligente y Gestión Proactiva de Eventos.',
        contentText:
          'VZOR®️ Suite AIOps aplica Inteligencia Artificial, Machine Learning y motores de reglas para automatizar, correlacionar y anticipar incidentes en entornos tecnológicos complejos.',
        solutions: [
          makeSolution(
            1,
            'VZOR®️ Event Manager',
            'Realiza correlación inteligente de eventos provenientes de distintas fuentes, reduciendo ruido y enfocando la atención en lo realmente crítico.',
            'bg-[var(--color-vzor-blue-500)]/30',
            'eventManager',
            'solutions/event-manager'
          ),
          makeSolution(
            2,
            'VZOR®️ Brain Monitor',
            'IA para correlacionar eventos y detectar anomalías.',
            'bg-[var(--color-vzor-blue-300)]/30',
            'brainMonitor',
            'solutions/brain-monitor'
          ),
          makeSolution(
            3,
            'VZOR®️ Playbook Manager',
            'Ejecuta recetas de autoremediación o acciones correctivas automatizadas, reduciendo el tiempo medio de resolución (MTTR).',
            'bg-[var(--color-vzor-blue-900)]/30',
            'playbookManager',
            'solutions/playbook-manager'
          ),
          makeSolution(
            4,
            'VZOR®️ Network Topology Manager',
            'Descubre y visualiza de forma automática la topología de red lógica y física, mostrando dependencias, rutas críticas y estado en tiempo real.',
            'bg-orange-300',
            'topologyManager',
            'solutions/network-topology'
          ),
        ],
      },
      {
        id: 'itmgmt',
        label: 'VZOR®️ Suite IT Management',
        href: '/plataforma/suiteitmgmt',
        color: '#003C71',
        contentTitle: 'Plataforma de Gestión de Activos, Riesgos y Operaciones TI.',
        contentText:
          'VZOR®️ Suite IT Management es una plataforma integral para la gestión, control y gobierno tecnológico, orientada a optimizar la eficiencia operativa y fortalecer la gobernanza TI a través de workflows automatizados, una CMDB integrada, gestión de tickets y control de inventario. Diseñada bajo los principios de ITIL, esta suite permite consolidar los procesos de soporte, seguridad y operación tecnológica en un solo entorno.',
        solutions: [
          makeSolution(
            1,
            'VZOR®️ CMDB',
            'Base de datos de configuración que mapea activos, relaciones y dependencias TI, integrada con monitoreo y gestión de cambios.',
            'bg-red-300',
            'appsMonitor',
            '/solutions/cmdb'
          ),
          makeSolution(
            2,
            'VZOR®️ Service Desk',
            'Mesa de ayuda con flujos automatizados, gestión de incidentes, requerimientos y cambios bajo SLAs configurables.',
            'bg-yellow-300',
            'serviceDesk',
            '/solutions/service-desk'
          ),
          makeSolution(
            3,
            'VZOR®️ Inventory Manager',
            'Gestión y trazabilidad de hardware, software y licencias, con auditoría completa y alertas por cambios o vencimientos.',
            'bg-teal-300',
            'inventManager',
            '/solutions/inventory-manager'
          ),
          makeSolution(
            4,
            'VZOR®️ IPAM',
            'Administración centralizada de direcciones IP y subredes, con trazabilidad e integración directa al inventario y monitoreo.',
            'bg-teal-300',
            'ipam',
            'solutions/ipam'
          ),
        ],
      },
    ];

    defaults.forEach((tab) => {
      this.solutionTabService.createSolutionTab(tab).subscribe({
        next: () => {
          // recarga de lista vendrá sola por el onSnapshot de Firestore
        },
        error: (error) => {
          this.handleRequestError(error);
        },
      });
    });
  }
}


