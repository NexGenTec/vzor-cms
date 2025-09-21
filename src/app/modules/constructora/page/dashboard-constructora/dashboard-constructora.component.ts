import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConstructoraHeaderComponent } from './components/constructora-header/constructora-header.component';
import { ConstructoraAuctionsTableComponent } from './components/constructora-auctions-table/constructora-auctions-table.component';
import { ConstructoraChartCardComponent } from './components/constructora-chart-card/constructora-chart-card.component';
import { ConstructoraSingleCardComponent } from './components/constructora-single-card/constructora-single-card.component';
import { Product } from '../../../dashboard/models/product';
import { ProductsService } from '../product/service/products.service';
import { ConstructoraDualCardComponent } from './components/constructora-dual-card/constructora-dual-card.component';
import { ProjectsService } from '../project/service/project.service';
import { TeamService } from '../team/service/team.service';
import { Project } from '../project/project.component';
import { Team } from '../team/team.component';
import { Task } from '../../../dashboard/models/task';
import { TaskService } from '../../../dashboard/service/task.service';

@Component({
  selector: 'app-dashboard-constructora',
  standalone: true,
  imports: [
      ConstructoraHeaderComponent,
      ConstructoraAuctionsTableComponent,
      ConstructoraChartCardComponent,
      ConstructoraSingleCardComponent,
      ConstructoraDualCardComponent,
      NgIf,
      NgStyle,
      FormsModule,
      CommonModule
  ],
  templateUrl: './dashboard-constructora.component.html',
  styleUrl: './dashboard-constructora.component.scss'
})
export class DashboardConstructoraComponent {
  product = signal<Product[]>([]);
  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  teams = signal<Team[]>([]);
  isLoading = true;

  // Estadísticas computadas
  totalTasks = computed(() => this.tasks().length);
  pendingTasks = computed(() => this.tasks().filter(task => !task.completed).length);
  completedTasks = computed(() => this.tasks().filter(task => task.completed).length);
  totalProjects = computed(() => this.projects().length);
  activeProjects = computed(() => this.projects().filter(project => project.status === 'Activo').length);
  totalTeams = computed(() => this.teams().length);
  activeTeams = computed(() => this.teams().filter(team => team.status === 'Activo').length);
  totalProducts = computed(() => this.product().length);

  constructor(
    private productService: ProductsService,
    private taskService: TaskService,
    private projectService: ProjectsService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    
    // Cargar productos
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        const sortedProducts = products.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        this.product.set(sortedProducts.slice(0, 2));
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
      }
    });

    // Cargar tareas
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks.set(tasks);
      },
      error: (error: any) => {
        console.error('Error al cargar tareas:', error);
      }
    });

    // Cargar proyectos
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects.set(projects);
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    });

    // Cargar equipos
    this.teamService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.teams.set(teams);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
        this.isLoading = false;
      }
    });
  }

  handleRequestError(error: any) {
    console.error('Error al cargar datos:', error);
  }

  // Métodos para obtener datos para los componentes
  getRecentTasks() {
    return this.tasks().slice(0, 5);
  }

  getRecentProjects() {
    return this.projects().slice(0, 5);
  }

  getRecentTeams() {
    return this.teams().slice(0, 5);
  }

  getTaskCompletionRate() {
    const total = this.totalTasks();
    const completed = this.completedTasks();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getProjectCompletionRate() {
    const total = this.totalProjects();
    const active = this.activeProjects();
    return total > 0 ? Math.round((active / total) * 100) : 0;
  }
}
