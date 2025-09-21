import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserFilterService } from '../../service/user-filter.service';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-user-action',
  standalone: true,
  imports: [AngularSvgIconModule,CommonModule],
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss'
})
export class UserActionComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: string[] = [];

  constructor(
    public userFilter: UserFilterService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
      this.extractRoles();
    });
  }

  extractRoles() {
    const uniqueRoles = new Set(this.users.map(user => user.Roles[0]));
    this.roles = Array.from(uniqueRoles);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userFilter.searchField.set(input.value);
  }

  onRoleChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.userFilter.roleField.set(selectElement.value);
  }
  

  onOrderChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.userFilter.orderField.set(select.value);
  }

  applyFilters() {
    const searchText = this.userFilter.searchField().toLowerCase();
    const selectedRole = this.userFilter.roleField();
    const selectedOrder = this.userFilter.orderField();

    this.filteredUsers = this.users
      .filter(user =>
        user.name.toLowerCase().includes(searchText) &&
        (selectedRole === '' || user.Roles[0] === selectedRole)
      )
      .sort((a, b) => {
        switch (selectedOrder) {
          case '1': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case '2': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case '3': return a.name.localeCompare(b.name);
          case '4': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
  }


}
