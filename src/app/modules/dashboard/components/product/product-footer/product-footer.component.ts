import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-product-footer',
  standalone: true,
  imports: [AngularSvgIconModule,CommonModule],
  templateUrl: './product-footer.component.html',
  styleUrl: './product-footer.component.scss'
})
export class ProductFooterComponent {
  @Input() currentPage: number = 1;
  @Input() totalProducts: number = 100;
  @Input() pageSize: number = 10;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  totalPages() {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  totalProductsDisplay(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalProducts);
    return `${start}-${end}`;
  }   

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    this.pageChanged.emit(page);
  }

  onPageSizeChange(event: any) {
    const size = parseInt(event.target.value, 10);
    this.pageSizeChanged.emit(size);
  }  
}
