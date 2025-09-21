import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../../project/project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgStyle } from '@angular/common';
import { ProjectsService } from '../../../../project/service/project.service';

@Component({
  selector: '[app-project-row]',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './project-row.component.html',
  styleUrl: './project-row.component.scss'
})
export class ProjectRowComponent {
  @Input() project!: Project;
  @Input() onEditProject!: (project: Project) => void;
  @Output() rowClicked = new EventEmitter<Project>();

  isDeleteModalOpen = false;
  projectToDelete: string | null = null;

  constructor(private projectsService: ProjectsService) {}

  editProject(project: Project) {
    this.onEditProject(project);
  }

  openDeleteModal(projectId: string) {
    this.projectToDelete = projectId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.projectToDelete = null;
  }

  confirmDelete() {
    if (this.projectToDelete) {
      this.projectsService.deleteProject(this.projectToDelete).then(() => {
        // Emitir evento para actualizar la lista
        this.rowClicked.emit(this.project);
        this.closeDeleteModal();
      }).catch((error) => {
        console.error('Error deleting project:', error);
        this.closeDeleteModal();
      });
    }
  }

  viewProject(projectId: string) {
    // Implementar navegación a vista detallada del proyecto
    console.log('Viewing project:', projectId);
  }
}
