import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Team } from '../../../../team/team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgStyle } from '@angular/common';
import { TeamService } from '../../../../team/service/team.service';

@Component({
  selector: '[app-team-row]',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './team-row.component.html',
  styleUrl: './team-row.component.scss'
})
export class TeamRowComponent {
  @Input() team!: Team;
  @Input() onEditTeam!: (team: Team) => void;
  @Output() rowClicked = new EventEmitter<Team>();

  isDeleteModalOpen = false;
  teamToDelete: string | null = null;

  constructor(private teamService: TeamService) {}

  editTeam(team: Team) {
    this.onEditTeam(team);
  }

  openDeleteModal(teamId: string) {
    this.teamToDelete = teamId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.teamToDelete = null;
  }

  confirmDelete() {
    if (this.teamToDelete) {
      this.teamService.deleteTeam(this.teamToDelete).then(() => {
        // Emitir evento para actualizar la lista
        this.rowClicked.emit(this.team);
        this.closeDeleteModal();
      }).catch((error) => {
        console.error('Error deleting team:', error);
        this.closeDeleteModal();
      });
    }
  }

  viewTeam(teamId: string) {
    // Implementar navegación a vista detallada del equipo
    console.log('Viewing team:', teamId);
  }
} 