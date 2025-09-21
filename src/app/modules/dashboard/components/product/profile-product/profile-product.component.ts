import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../models/product';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-product',
  standalone: true,
  imports: [AngularSvgIconModule, FormsModule, CommonModule,NgClass],
  templateUrl: './profile-product.component.html',
  styleUrls: ['./profile-product.component.scss'],
})
export class ProfileProductComponent implements OnInit {
  product!: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe((product) => {
        this.product = product;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
