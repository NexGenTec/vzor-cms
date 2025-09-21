import { Component, computed, signal } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { UserService } from '../../service/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserFooterComponent } from '../../components/user-footer/user-footer.component';
import { UserActionComponent } from '../../components/user-action/user-action.component';
import { UserRowComponent } from '../../components/user-row/user-row.component';
import { UserHeaderComponent } from '../../components/user-header/user-header.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ProductFilterService } from '../../../dashboard/service/product-filter.service';
import { toast } from 'ngx-sonner';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { UserFilterService } from '../../service/user-filter.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [    
      AngularSvgIconModule,
      FormsModule,
      UserFooterComponent,
      UserActionComponent,
      UserRowComponent,
      UserHeaderComponent,
      ReactiveFormsModule,
      CommonModule,
    ModalComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users = signal<User[]>([]);
  isModalOpen = false;
  selectedUser!: User;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;



  constructor(private userService: UserService,
    private filterService: UserFilterService,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }


  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users.update(() => users);
        console.log('Usuarios cargados:', users);
      },
      error: (error) => {
        this.handleRequestError(error);
      }
    });
  }  
  
  public toggleUsers(checked: boolean) {
    this.users.update((users) => {
      return users.map((user) => {
        return { ...user, selected: checked };
      });
    });
  }
  
  private handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener los usuarios. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
      action: {
        label: 'Deshacer',
        onClick: () => console.log('¡Acción deshecha!'),
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  } 
  
  filteredUsers = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const role = this.filterService.roleField().toLowerCase();
    const order = this.filterService.orderField();
  
    return this.users()
      .filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.Roles[0].toLowerCase().includes(search)
      )
      .filter(user => role === '' || user.Roles[0].toLowerCase() === role)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
  
        if (order === '1') return dateB.getTime() - dateA.getTime(); // Más reciente
        if (order === '2') return dateA.getTime() - dateB.getTime(); // Más antiguo
        if (order === '3') return b.name.localeCompare(a.name); // Nombre descendente
        if (order === '4') return a.name.localeCompare(b.name); // Nombre ascendente
        return 0;
      });
  });
    
  
    
  openModal() {
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = {} as User; 
  }
  
  openEditModal(user: User) {
    this.selectedUser = user;
    this.openModal();
  }

  openExportConfirmation(exportType: 'pdf' | 'csv') {
    this.isExporting = exportType;
    this.isModalOpenExport = true;
  }

  // Handle export after confirmation
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
    autoTable(doc, {
      head: [['Nombre', 'Correo Electrónico', 'Rol', 'Fecha de Creación']],
      body: this.filteredUsers().map(user => [
        user.name || '', 
        user.email || '', 
        user.Roles[0] || '',
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
      ])
    });
    doc.save('usuarios.pdf');
  }
  
  
  exportToCSV() {
    const headers = 'Nombre,Correo Electrónico,Rol,Fecha de Creación\n';
    const rows = this.filteredUsers().map(user => [
      user.name, 
      user.email, 
      user.Roles[0],
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    ].join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'usuarios.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  
}
