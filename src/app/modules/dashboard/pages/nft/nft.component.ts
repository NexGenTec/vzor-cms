import { Component, OnInit } from '@angular/core';
import { NftAuctionsTableComponent } from '../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../../components/nft/nft-chart-card/nft-chart-card.component';
import { NftSingleCardComponent } from '../../components/nft/nft-single-card/nft-single-card.component';
import { NftDualCardComponent } from '../../components/nft/nft-dual-card/nft-dual-card.component';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { CommonModule, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-nft',
    templateUrl: './nft.component.html',
    standalone: true,
    imports: [
        NftHeaderComponent,
        NftDualCardComponent,
        NftSingleCardComponent,
        NftChartCardComponent,
        NftAuctionsTableComponent,
        NgIf,
        NgStyle,
        FormsModule,
        CommonModule
    ],
})
export class NftComponent implements OnInit {
  product: Product[] = [];
  isLoading = true;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        const sortedProducts = products.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        this.product = sortedProducts.slice(0, 2);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleRequestError(error);
      }
    });
  }  

  handleRequestError(error: any) {
    console.error('Error al cargar productos:', error);
  }
}
