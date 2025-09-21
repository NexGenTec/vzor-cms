import { Component } from '@angular/core';
import { FilterProjectService } from '../../../../project/service/filter-project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-project-action',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './project-action.component.html',
  styleUrl: './project-action.component.scss'
})
export class ProjectActionComponent {
  projects: any[] = [];
  filteredProjects: any[] = [];

  constructor(private filterService: FilterProjectService) {}

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    this.filterService.setSearchField(searchTerm);
  }

  onCategoryChange(event: any) {
    const category = event.target.value;
    this.filterService.setCategoryField(category);
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
