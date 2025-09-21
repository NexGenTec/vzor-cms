import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: '[app-product-row]',
  standalone: true,
  imports: [AngularSvgIconModule, FormsModule, CommonModule],
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.scss']
})
export class ProductRowComponent {
  @Input() product: Product = {} as Product;
  @Input() onEditProduct: (product: Product) => void = () => {};
  @Input() onDeleteProduct: (product: Product) => void = () => {};

  isDeleteModalOpen: boolean = false;
  productToDeleteId: string = '';

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}
  
  
  editProduct(product: Product) {
    console.log('Editando producto:', product);
    this.onEditProduct(product);
  }


  openDeleteModal(product: Product) {
    this.isDeleteModalOpen = true;
    this.onDeleteProduct(product);
    this.productToDeleteId = product.id;
  }


  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.productToDeleteId = '';
  }


  confirmDelete() {
    if (this.productToDeleteId) {
      this.deleteProduct(this.productToDeleteId);
      this.closeDeleteModal(); 
    }
  }

  
  deleteProduct(id: string) {
    this.productService.deleteProduct(id).then(() => {
      console.log('Producto eliminado');
      toast.success('Producto eliminado correctamente', {
        position: 'top-right',
        description: 'El producto ha sido eliminado con éxito.',
        action: {
          label: 'Deshacer',
          onClick: () => console.log('¡Acción deshecha!'),
        },
        actionButtonStyle: 'background-color:#DC2626; color:white;',
      });
    }).catch((error) => {
      console.error('Error al eliminar el producto:', error);
      toast.error('Error al eliminar el producto', {
        position: 'top-right',
        description: error.message || 'No se pudo eliminar el producto.',
      });
    });
  }

  viewProduct(productId: string) {
    this.router.navigate(['/layout/dashboard/product', productId]);
  }
}