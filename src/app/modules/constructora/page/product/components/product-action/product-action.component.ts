import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { Product } from '../../../../../dashboard/models/product';
import { ProductsFilterService } from '../../service/products-filter.service';
import { ProductsService } from '../../service/products.service';
import { ProductSelectionService } from '../../../../../dashboard/service/product-selection.service';

@Component({
  selector: 'app-product-action',
  standalone: true,
  imports: [AngularSvgIconModule,CommonModule],
  templateUrl: './product-action.component.html',
  styleUrl: './product-action.component.scss'
})
export class ProductActionComponent {
  product: Product[] = [];
  categories: Product[] = []
  filteredProduct: Product[] = [];
  selectedProducts: Product[] = [];
  isDeleteMultipleModalOpen = false;
  
  constructor(
    public productFilter: ProductsFilterService,
    private productService: ProductsService,
    private productSelectionService: ProductSelectionService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(categories => {
      this.categories = categories;
      this.product = this.categories;
      this.filteredProduct = categories;
    });
    this.productSelectionService.selectedProducts$.subscribe(products => {
      this.selectedProducts = products;
    });
  }

  deleteSelected() {
    const selectedIds = this.selectedProducts.map(p => p.id);
    if (selectedIds.length > 0) {
      selectedIds.forEach(async id => {
        await this.productService.deleteProduct(id);
        toast.success('Producto eliminado correctamente');
        this.product = this.product.filter(p => p.id !== id);
      });
      this.selectedProducts = [];
    }
  }
   

  onSearchChange(value: Event) {
    const input = value.target as HTMLInputElement;
    this.productFilter.searchField.set(input.value);
  }

  onStatusChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.productFilter.statusField.set(selectElement.value);
  }

  onOrderChange(value: Event) {
    const selectElement = value.target as HTMLSelectElement;
    this.productFilter.orderField.set(selectElement.value);
  }

}
