import { Component, Input, OnInit } from '@angular/core';
import { NgStyle, CurrencyPipe, NgFor, CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Router } from '@angular/router';

@Component({
    selector: '[nft-single-card]',
    templateUrl: './nft-single-card.component.html',
    standalone: true,
    imports: [NgStyle, CurrencyPipe],
})
export class NftSingleCardComponent implements OnInit {
  @Input() product: Product = <Product>{};

  constructor( private router: Router) {}

  ngOnInit(): void {}

  viewProduct(productId: string) {
    this.router.navigate(['/layout/dashboard/product', productId]);
  }
}
