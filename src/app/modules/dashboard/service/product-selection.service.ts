import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductSelectionService {

  private selectedProductsSource = new BehaviorSubject<Product[]>([]);
  selectedProducts$ = this.selectedProductsSource.asObservable();

  updateSelectedProducts(products: Product[]) {
    this.selectedProductsSource.next(products);
  }
}
