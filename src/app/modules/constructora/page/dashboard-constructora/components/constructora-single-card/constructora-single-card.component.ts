import { Component, Input } from '@angular/core';
import { Product } from '../../../../../dashboard/models/product';
import { Router } from '@angular/router';
import { NgStyle, CurrencyPipe } from '@angular/common';

@Component({
  selector: '[app-constructora-single-card]',
  standalone: true,
  imports: [NgStyle, CurrencyPipe],
  templateUrl: './constructora-single-card.component.html',
  styleUrl: './constructora-single-card.component.scss'
})
export class ConstructoraSingleCardComponent {
  @Input() product: Product = <Product>{};

  constructor( private router: Router) {}

  ngOnInit(): void {}

  viewProduct(productId: string) {
    this.router.navigate(['/layout/constructora/products', productId]);
  }
}
