import { Component } from '@angular/core';
import { FilterTeamService } from '../../../../team/service/filter-team.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-team-action',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './team-action.component.html',
  styleUrl: './team-action.component.scss'
})
export class TeamActionComponent {
  teams: any[] = [];
  filteredTeams: any[] = [];

  constructor(private filterService: FilterTeamService) {}

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    this.filterService.setSearchField(searchTerm);
  }

  onDepartmentChange(event: any) {
    const department = event.target.value;
    this.filterService.setDepartmentField(department);
  }

  onStatusChange(event: any) {
    const status = event.target.value;
    this.filterService.setStatusField(status);
  }

  onOrderChange(event: any) {
    const order = event.target.value;
    this.filterService.setOrderField(order);
  }
} 