import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toast } from 'ngx-sonner';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-user-row]',
  standalone: true,
  imports: [AngularSvgIconModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './user-row.component.html',
  styleUrl: './user-row.component.scss'
})
export class UserRowComponent {
    @Input() user: User = {} as User;
    @Input() onEditProduct: (user: User) => void = () => {};
    @Output() selectedChange = new EventEmitter<boolean>();
  
    // Estado del modal
    isDeleteModalOpen: boolean = false;
    userToDeleteId: string = ''; // Almacena el id del user a eliminar
  
    constructor(
      private userService: UserService,
    ) {}
  
    // Cambia la selección del producto
    toggleSelection() {
      this.user.selected = !this.user.selected;
      this.selectedChange.emit(this.user.selected);
    }
  
    // Edita el producto
    editProduct(user: User) {
      console.log('Editando producto:', user);
      this.onEditProduct(user);
    }
  
    // Abre el modal de eliminación
    openDeleteModal(userId: string) {
      this.isDeleteModalOpen = true;
      this.userToDeleteId = userId;
    }
  
    // Cierra el modal de eliminación
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.userToDeleteId = '';
    }
  
    // Confirma la eliminación
    confirmDelete() {
      if (this.userToDeleteId) {
        this.deleteUser(this.userToDeleteId);
        this.closeDeleteModal(); 
      }
    }
  
    // Elimina el producto
    deleteUser(id: string) {
      // this.productService.deleteProduct(id).then(() => {
      //   console.log('Producto eliminado');
      //   toast.success('Producto eliminado correctamente', {
      //     position: 'top-right',
      //     description: 'El producto ha sido eliminado con éxito.',
      //     action: {
      //       label: 'Deshacer',
      //       onClick: () => console.log('¡Acción deshecha!'),
      //     },
      //     actionButtonStyle: 'background-color:#DC2626; color:white;',
      //   });
      // }).catch((error) => {
      //   console.error('Error al eliminar el producto:', error);
      //   toast.error('Error al eliminar el producto', {
      //     position: 'top-right',
      //     description: error.message || 'No se pudo eliminar el producto.',
      //   });
      // });
    }

}
