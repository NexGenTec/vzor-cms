import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { FilterProjectService } from './service/filter-project.service';
import { toast } from 'ngx-sonner';
import { ProjectsService } from './service/project.service';
import Papa from 'papaparse';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ProjectFooterComponent } from './components/components/project-footer/project-footer.component';
import { ProjectActionComponent } from './components/components/project-action/project-action.component';
import { ProjectRowComponent } from './components/components/project-row/project-row.component';
import { ProjectHeaderComponent } from './components/components/project-header/project-header.component';
import { AddProjectModalComponent } from './components/components/add-project-modal/add-project-modal.component';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt?: string;
  status?: string;
  selected?: boolean;
  uid: string;
  equipos?: any[];
  productos?: any[];
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    ProjectFooterComponent,
    ProjectActionComponent,
    ProjectRowComponent,
    ProjectHeaderComponent,
    AddProjectModalComponent,
    CommonModule,
    ModalComponent,
    ReactiveFormsModule
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  project = signal<Project[]>([]);
  isModalOpen = false;
  selectedProject!: Project;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;
  isLoading = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  isModalOpenCSV = false;
  currentPage = 1;
  pageSize = 10;
  totalProjects = 0;

  constructor(
    private filterService: FilterProjectService,
    private projectService: ProjectsService,
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.totalProjects = projects.length;
        this.project.update(() => projects);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  pagedProjects() {
    const filtered = this.filteredProjects();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  isDeleteButtonEnabled() {
    const selected = this.selectedProjects();
    return selected.length >= 1;
  }

  selectedProjects = computed(() => this.project().filter((p) => p.selected));

  activeProjectsCount = computed(() => 
    this.filteredProjects().filter(p => p.status === 'Activo').length
  );

  totalProjectsCount = computed(() => this.filteredProjects().length);

  allProjectsSelected = computed(() => {
    const filtered = this.filteredProjects();
    return filtered.length > 0 && filtered.every(p => p.selected);
  });

  toggleProjects(checked: boolean) {
    this.project.update((projects) =>
      projects.map((project) => ({
        ...project,
        selected: checked,
      }))
    );
  }

  toggleProjectSelection(project: Project) {
    this.project.update((projects) =>
      projects.map((p) =>
        p.id === project.id ? { ...p, selected: !p.selected } : p
      )
    );
  }

  deleteSelected() {
    const selectedProjectIds = this.selectedProjects().map((p) => p.id);

    this.projectService.deleteSelectedProjects(selectedProjectIds).subscribe({
      next: () => {
        this.project.update((projects) =>
          projects.filter((p) => !selectedProjectIds.includes(p.id))
        );
      },
      error: (error) => {
        console.error('Error al eliminar proyectos:', error);
      },
      complete: () => {
        console.log('Eliminación completada');
      },
    });
  }

  private handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener los proyectos. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
    });
  }

  filteredProjects = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const category = this.filterService.statusField();
    const order = this.filterService.orderField();

    // Filtrar por búsqueda
    const filteredBySearch = this.project().filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.category.toLowerCase().includes(search)
      return matchesSearch;
    });

    // Filtrar por categoría
    const filteredByCategory = filteredBySearch.filter((project) => {
      const categoryValue = String(category).toLowerCase();
      const projectCategory = String(project.category).toLowerCase();

      return !categoryValue || projectCategory === categoryValue;
    });

    // Ordenar los proyectos
    const sortedByOrder = filteredByCategory.sort((a, b) => {
      const defaultNewest = !order || order === '1';
      const dateA = new Date(a.createdAt!);
      const dateB = new Date(b.createdAt!);

      if (defaultNewest) {
        return dateB.getTime() - dateA.getTime();
      } else if (order === '2') {
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });

    return sortedByOrder;
  });

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = {} as Project;
  }

  openEditModal(project: Project) {
    this.selectedProject = project;
    this.openModal();
  }

  openExportConfirmation(exportType: 'pdf' | 'csv') {
    this.isExporting = exportType;
    this.isModalOpenExport = true;
  }

  handleExportConfirmation(exportType: 'pdf' | 'csv') {
    if (exportType === 'pdf') {
      this.exportToPDF();
    } else if (exportType === 'csv') {
      this.exportToCSV();
    }
    this.isModalOpenExport = false;
  }

  exportToPDF() {
    const doc = new jsPDF();

    doc.text('Lista de Proyectos', 14, 10);
    const columns = ['Nombre', 'Categoría', 'Descripción'];
    const rows = this.filteredProjects().map(project => [
      project.name,
      project.category,
      project.description
    ]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save('proyectos.pdf');
    toast.success('La exportación a PDF se ha realizado con éxito!',{
      position: 'top-right',
      duration: 5000,
    });
  }

  exportToCSV() {
    try {
      const csvData = this.filteredProjects().map(project => ({
        Nombre: project.name,
        Categoría: project.category,
        Descripción: project.description
      }));
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'proyectos.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('La exportación a CSV se ha realizado con éxito!',{
        position: 'top-right',
        duration: 1000,
      });
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      if (!this.selectedFile.name.endsWith('.csv')) {
        toast.error('Por favor, seleccione un archivo CSV válido.', {
          position: 'top-right',
          duration: 2000
        });
        return;
      }
      this.isModalOpenCSV = true;
    }
  }

  closeModalCsv() {
    this.isModalOpenCSV = false;
    this.selectedFile = null;
  }

  importCSV() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.isModalOpenCSV = false;

    this.projectService.importProjectsFromCSV(this.selectedFile).subscribe({
      next: () => {
        toast.success('Proyectos importados exitosamente', {
          position: 'top-right',
          duration: 2000
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al importar proyectos:', error);
        toast.error('Error al importar proyectos.', {
          position: 'top-right',
          duration: 2000
        });
        this.isLoading = false;
      }
    });
  }

  onProjectSaved(project: Project) {
    // Recargar la lista de proyectos después de guardar
    this.loadProjects();
    toast.success('Proyecto guardado exitosamente', {
      position: 'top-right',
      duration: 2000
    });
  }
}
