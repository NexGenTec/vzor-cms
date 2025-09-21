import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { FilterTeamService } from './service/filter-team.service';
import { toast } from 'ngx-sonner';
import { TeamService } from './service/team.service';
import Papa from 'papaparse';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import { CommonModule } from '@angular/common';
import { TeamRowComponent } from './components/components/team-row/team-row.component';
import { TeamHeaderComponent } from './components/components/team-header/team-header.component';
import { TeamFooterComponent } from './components/components/team-footer/team-footer.component';
import { TeamActionComponent } from './components/components/team-action/team-action.component';
import { AddTeamModalComponent } from './components/components/add-team-modal/add-team-modal.component';

export interface Team {
  id: string;
  name: string;
  description: string;
  department: string;
  createdAt?: string;
  status?: string;
  selected?: boolean;
  uid: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TeamFooterComponent,
    TeamActionComponent,
    TeamRowComponent,
    TeamHeaderComponent,
    AddTeamModalComponent,
    CommonModule,
    ModalComponent,
    ReactiveFormsModule
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  team = signal<Team[]>([]);
  isModalOpen = false;
  selectedTeam!: Team;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;
  isLoading = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  isModalOpenCSV = false;
  currentPage = 1;
  pageSize = 10;
  totalTeams = 0;

  constructor(
    private filterService: FilterTeamService,
    private teamService: TeamService,
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.totalTeams = teams.length;
        this.team.update(() => teams);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  pagedTeams() {
    const filtered = this.filteredTeams();
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
    const selected = this.selectedTeams();
    return selected.length >= 1;
  }

  selectedTeams = computed(() => this.team().filter((t) => t.selected));

  activeTeamsCount = computed(() => 
    this.filteredTeams().filter(t => t.status === 'Activo').length
  );

  totalTeamsCount = computed(() => this.filteredTeams().length);

  allTeamsSelected = computed(() => {
    const filtered = this.filteredTeams();
    return filtered.length > 0 && filtered.every(t => t.selected);
  });

  toggleTeams(checked: boolean) {
    this.team.update((teams) =>
      teams.map((team) => ({
        ...team,
        selected: checked,
      }))
    );
  }

  toggleTeamSelection(team: Team) {
    this.team.update((teams) =>
      teams.map((t) =>
        t.id === team.id ? { ...t, selected: !t.selected } : t
      )
    );
  }

  deleteSelected() {
    const selectedTeamIds = this.selectedTeams().map((t) => t.id);

    this.teamService.deleteSelectedTeams(selectedTeamIds).subscribe({
      next: () => {
        this.team.update((teams) =>
          teams.filter((t) => !selectedTeamIds.includes(t.id))
        );
      },
      error: (error) => {
        console.error('Error al eliminar equipos:', error);
      },
      complete: () => {
        console.log('Eliminación completada');
      },
    });
  }

  private handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener los equipos. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
    });
  }

  filteredTeams = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const department = this.filterService.departmentField();
    const status = this.filterService.statusField();
    const order = this.filterService.orderField();

    // Filtrar por búsqueda
    const filteredBySearch = this.team().filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(search) ||
        team.description.toLowerCase().includes(search) ||
        team.department.toLowerCase().includes(search)
      return matchesSearch;
    });

    // Filtrar por departamento
    const filteredByDepartment = filteredBySearch.filter((team) => {
      const departmentValue = String(department).toLowerCase();
      const teamDepartment = String(team.department).toLowerCase();

      return !departmentValue || teamDepartment === departmentValue;
    });

    // Filtrar por estado
    const filteredByStatus = filteredByDepartment.filter((team) => {
      const statusValue = String(status).toLowerCase();
      const teamStatus = String(team.status).toLowerCase();

      return !statusValue || teamStatus === statusValue;
    });

    // Ordenar los equipos
    const sortedByOrder = filteredByStatus.sort((a, b) => {
      const defaultNewest = !order || order === '1';
      const dateA = new Date(a.createdAt!);
      const dateB = new Date(b.createdAt!);

      if (defaultNewest) {
        return dateB.getTime() - dateA.getTime();
      } else if (order === '2') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === '3') {
        return a.name.localeCompare(b.name);
      } else if (order === '4') {
        return b.name.localeCompare(a.name);
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
    this.selectedTeam = {} as Team;
  }

  openEditModal(team: Team) {
    this.selectedTeam = team;
    this.isModalOpen = true;
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
    const teams = this.filteredTeams();

    const tableData = teams.map(team => [
      team.name,
      team.department,
      team.status || 'Sin estado',
      team.description,
      team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'Sin fecha'
    ]);

    autoTable(doc, {
      head: [['Nombre', 'Departamento', 'Estado', 'Descripción', 'Fecha de Creación']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save('equipos.pdf');
  }

  exportToCSV() {
    const teams = this.filteredTeams();
    const csvData = teams.map(team => [
      team.name,
      team.description,
      team.department,
      team.status || 'Sin estado',
      team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'Sin fecha'
    ]);

    const csv = Papa.unparse({
      fields: ['Nombre', 'Descripción', 'Departamento', 'Estado', 'Fecha de Creación'],
      data: csvData
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'equipos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.isModalOpenCSV = true;
    }
  }

  closeModalCsv() {
    this.isModalOpenCSV = false;
    this.selectedFile = null;
  }

  importCSV() {
    if (this.selectedFile) {
      this.isLoading = true;
      this.teamService.importTeamsFromCSV(this.selectedFile).subscribe({
        next: () => {
          this.loadTeams();
          toast.success('Equipos importados correctamente');
          this.closeModalCsv();
        },
        error: (error) => {
          console.error('Error importing teams:', error);
          toast.error('Error al importar equipos');
          this.isLoading = false;
        }
      });
    }
  }

  onTeamSaved(team: Team) {
    this.loadTeams();
    toast.success('Equipo guardado correctamente');
  }
}
