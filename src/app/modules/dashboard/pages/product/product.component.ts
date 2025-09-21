import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ProductActionComponent } from '../../components/product/product-action/product-action.component';
import { ProductFooterComponent } from '../../components/product/product-footer/product-footer.component';
import { ProductHeaderComponent } from '../../components/product/product-header/product-header.component';
import { ProductRowComponent } from '../../components/product/product-row/product-row.component';
import { toast } from 'ngx-sonner';
import { Product } from '../../models/product';
import { ProductFilterService } from '../../service/product-filter.service';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from '../../components/product/add-product-modal/add-product-modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { ModalComponent } from '../../components/modal/modal/modal.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    ProductFooterComponent,
    ProductActionComponent,
    ProductRowComponent,
    ProductHeaderComponent,
    AddProductModalComponent,
    CommonModule,
    ModalComponent
],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {

  product = signal<Product[]>([]);
  isModalOpen = false;
  selectedProduct!: Product ;
  isModalOpenExport = false;
  isExporting: 'pdf' | 'csv' | null = null;
  isLoading = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  isModalOpenCSV = false;
  currentPage = 1;
  pageSize = 10;
  totalProducts = 0;

  constructor(
    private filterService: ProductFilterService,
    private productService: ProductService,) {

  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.totalProducts = products.length;
        this.product.update(() => products);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  pagedProducts() {
    const filtered = this.filteredProducts();
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
    const selected = this.selectedProducts();
    return selected.length >= 1;
  }    
  
  selectedProducts = computed(() => this.product().filter((p) => p.selected));

  toggleProducts(checked: boolean) {
    this.product.update((products) =>
      products.map((product) => ({
        ...product,
        selected: checked,
      }))
    );
  }

  toggleProductSelection(product: Product) {
    this.product.update((products) =>
      products.map((p) =>
        p.id === product.id ? { ...p, selected: !p.selected } : p
      )
    );
  }  

  deleteSelected() {
    const selectedProductIds = this.selectedProducts().map((p) => p.id);

    this.productService.deleteSelectedProducts(selectedProductIds).subscribe({
      next: () => {
        this.product.update((products) =>
          products.filter((p) => !selectedProductIds.includes(p.id))
        );
      },
      error: (error) => {
        console.error('Error al eliminar productos:', error);
      },
      complete: () => {
        console.log('Eliminación completada');
      },
    });
  }

  private handleRequestError(error: any) {
    const msg = 'Ocurrió un error al obtener los productos. Cargando datos de ejemplo como alternativa.';
    toast.error(msg, {
      position: 'top-right',
      description: error.message,
    });
  } 

  filteredProducts = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    const category = this.filterService.statusField();
    const order = this.filterService.orderField();
  
    // Filtrar por búsqueda
    const filteredBySearch = this.product().filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      return matchesSearch;
    });  
    
    // Filtrar por categoría
    const filteredByCategory = filteredBySearch.filter((product) => {
      const categoryValue = String(category).toLowerCase();
      const productCategory = String(product.category).toLowerCase();
      
      return !categoryValue || productCategory === categoryValue;
    });
  
  
    // Ordenar los productos
    const sortedByOrder = filteredByCategory.sort((a, b) => {
      const defaultNewest = !order || order === '1';
      const dateA = new Date(a.createdAt!);
      const dateB = new Date(b.createdAt!);
  
      if (defaultNewest) {
        return dateB.getTime() - dateA.getTime();
      } else if (order === '2') {
        return dateA.getTime() - dateB.getTime();
      } else if (order === '3') {
        return b.price - a.price;
      } else if (order === '4') {
        return a.price - b.price;
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
    this.selectedProduct = {} as Product; 
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.openModal();
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
  
    doc.text('Lista de Productos', 14, 10);
    const columns = ['Nombre', 'Categoría', 'Descripción', 'Precio'];
    const rows = this.filteredProducts().map(product => [
      product.name,
      product.category,
      product.description,
      `$${product.price.toFixed(2)}`
    ]);
    autoTable(doc, { head: [columns], body: rows });
    doc.save('productos.pdf');
    toast.success('La exportación a PDF se ha realizado con éxito!',{
      position: 'top-right',
      duration: 5000,
    });
  }
  
  exportToCSV() {
    try {
      const csvData = this.filteredProducts().map(product => ({
        Nombre: product.name,
        Categoría: product.category,
        Descripción: product.description,
        Precio: product.price.toFixed(2)
      }));
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('La exportación a CSV se ha realizado con éxito!',{
        position: 'top-right',
        duration: 1000,
        actionButtonStyle: 'background-color:#DC2626; color:green;',
      });
    } catch (error) {
      this.handleRequestError(error);
    }
  }


  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];

      if (!this.selectedFile.name.endsWith('.csv')) {
        toast.error('Por favor, seleccione un archivo CSV válido.', {
          position: 'top-right',
          duration: 2000
        });
        return;
      }
      this.isModalOpenCSV = true;
    }
  }

  closeModalCsv() {
    this.isModalOpenCSV = false;
    this.selectedFile = null;
  }

  importCSV() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.isModalOpenCSV = false;

    this.productService.importProductsFromCSV(this.selectedFile).subscribe({
      next: () => {
        toast.success('Productos importados exitosamente', {
          position: 'top-right',
          duration: 2000
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al importar productos:', error);
        toast.error('Error al importar productos.', {
          position: 'top-right',
          duration: 2000
        });
        this.isLoading = false;
      }
    });
  }
}
