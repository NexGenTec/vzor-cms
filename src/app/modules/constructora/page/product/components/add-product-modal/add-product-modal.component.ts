import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import Papa from 'papaparse';  
import { ProductsService } from '../../service/products.service';
import { Product } from '../../../../../dashboard/models/product';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DecimalPipe], 
  templateUrl: './add-product-modal.component.html',
  styleUrl: './add-product-modal.component.scss'
})
export class AddProductModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() addProductEvent = new EventEmitter<Product>();
  @Input() product!: Product ; 
  productForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploadProgress: number = 0;
  categories: Product[] = []; 
  isOtherCategorySelected: boolean = false;
  rating = 0;
  stars = [1, 2, 3, 4, 5];
  tags: string[] = [];
  maxTags = 10;
  
  
  constructor(
    private fb: FormBuilder, 
    private productService: ProductsService,
    private storage: AngularFireStorage,
    private decimalPipe: DecimalPipe,
    private router: Router) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      customCategory: ['', []],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      isActive: [true],
      tags: ['', [Validators.pattern(/^[\w\s,-]+$/)]],
      rating: [, [Validators.min(0), Validators.max(5)]],
      discountPrice: [null, [Validators.min(0)]],
      discountPercentage: [null, [Validators.min(0), Validators.max(100)]],
      availabilityStatus: ['', [Validators.required]],
      createdAt: [new Date().toISOString(), [Validators.required]],
      updatedAt: [null],
    });

    this.productForm.get('price')?.valueChanges.subscribe(() => this.updateDiscountPercentage());
    this.productForm.get('discountPrice')?.valueChanges.subscribe(() => this.updateDiscountPercentage());
  }

  ngOnInit() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        category: this.product.category,
        price: this.product.price,
        stock: this.product.stock,
        isActive: this.product.isActive,
        tags: this.product.tags,
        rating: this.product.rating,
        availabilityStatus: this.product.availabilityStatus,
        createdAt: this.product.createdAt,
        updatedAt: this.product.updatedAt,
      });
      this.rating = this.product.rating || 0;
      if (this.product.imageUrl) {
        this.imagePreview = this.product.imageUrl;
      }
    }
    this.productService.getProducts().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
  
      if (this.isOtherCategorySelected && this.productForm.get('customCategory')?.value) {
        product.category = this.productForm.get('customCategory')?.value;
      }
  
      if (this.selectedFile) {
        // Solo sube la imagen si se ha seleccionado un archivo
        const filePath = `${product.category}/${product.name}/${this.selectedFile?.name}`;
        const fileRef = this.storage.ref(filePath);
        const products = this.storage.upload(filePath, this.selectedFile);
  
        products.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              product.imageUrl = url;
              this.saveProduct(product);
            });
          })
        ).subscribe();
      } else {
        // Si no se ha seleccionado una imagen, guarda el producto sin la URL de la imagen
        this.saveProduct(product);
      }
    } else {
      toast.error('Por favor, complete todos los campos correctamente.', {
        position: 'top-right',
      });
    }
  }
  
  saveProduct(product: Product) {
    if (this.product && this.product.id) {
      // Editar el producto existente
      this.productService.updateProduct(this.product.id.toString(), product)
        .then(() => {
          toast.success('Producto editado exitosamente.', {
            position: 'top-right',
          });
          this.closeModal();
        })
        .catch(error => {
          toast.error('Hubo un error al editar el producto.', {
            position: 'top-right',
          });
          console.error('Error al editar el producto: ', error);
          
          // Redirigir dependiendo del tipo de error
          if (error.status === 404) {
            this.router.navigate(['/errors/404']);
          } else if (error.status === 500) {
            this.router.navigate(['/errors/500']);
          }
        });
    } else {
      // Crear el producto
      this.productService.addProduct(product).subscribe({
        next: () => {
          toast.success('Producto agregado exitosamente.', {
            position: 'top-right',
          });
          this.closeModal();
        },
        error: (error) => {
          toast.error('Hubo un error al agregar el producto.', {
            position: 'top-right',
          });
          console.error('Error al agregar el producto: ', error);
          
          // Redirigir dependiendo del tipo de error
          if (error.status === 404) {
            this.router.navigate(['/errors/404']);
          } else if (error.status === 500) {
            this.router.navigate(['/errors/500']);
          }
        }
      });
    }
  }  

  closeModal() {
    this.closeModalEvent.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryChange(event: any) {
    const selectedCategory = event.target.value;
    if (selectedCategory === 'other') {
      this.isOtherCategorySelected = true;
      this.productForm.get('customCategory')?.setValidators([Validators.required]);
      this.productForm.get('category')?.clearValidators();
    } else {
      this.isOtherCategorySelected = false;
      this.productForm.get('customCategory')?.clearValidators();
      this.productForm.get('category')?.setValidators([Validators.required]);
    }
    this.productForm.get('customCategory')?.updateValueAndValidity();
    this.productForm.get('category')?.updateValueAndValidity();
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.productForm.patchValue({
      rating: this.rating 
    });
  }

  /**
   * Calcula el porcentaje de descuento basado en el precio y el precio con descuento.
   */
  updateDiscountPercentage(): void {
    const price = this.productForm.get('price')?.value || 0;
    const discountPrice = this.productForm.get('discountPrice')?.value || 0;
  
    if (price > 0) {
      if (discountPrice > price) {
        toast.error('El precio con descuento no puede ser mayor que el precio.', {
          position: 'top-right',
        });
        this.productForm.patchValue({
          discountPrice: null,
          discountPercentage: null,
        });
        return;
      }
  
      const discountPercentage = ((price - discountPrice) / price) * 100;
      this.productForm.patchValue({
        discountPercentage: discountPercentage.toFixed(2),
      });
    }
  }

  addTag(): void {
    const tagInput = this.productForm.get('tags')?.value?.trim();
    if (tagInput && this.tags.length < this.maxTags) {
      if (!this.tags.includes(tagInput)) {
        this.tags.push(tagInput);
        // Actualiza el valor del campo 'tags' en el formulario
        this.productForm.get('tags')?.setValue(this.tags);
        this.productForm.get('tags')?.reset();
      } else {
        toast.error('Esta etiqueta ya existe.', { position: 'top-right' });
      }
    } else if (this.tags.length >= this.maxTags) {
      toast.error('No puedes añadir más de 10 etiquetas.', { position: 'top-right' });
    }
  }  

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  //  // Método para manejar la carga y análisis del CSV
  //  onFileSelectedCSV(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.parseCSV(reader.result as string);
  //     };
  //     reader.readAsText(file);
  //   }
  // }

  // parseCSV(csv: string) {
  //   Papa.parse(csv, {
  //     header: true,  // Asegúrate de que el CSV tenga una cabecera
  //     skipEmptyLines: true,
  //     complete: (result) => {
  //       const products = result.data;
  //       products.forEach((productData: any) => {
  //         this.productForm.patchValue({
  //           name: productData.name,
  //           description: productData.description,
  //           category: productData.category,
  //           price: productData.price,
  //           stock: productData.stock,
  //           tags: productData.tags ? productData.tags.split(',') : [],
  //           rating: productData.rating,
  //           discountPrice: productData.discountPrice,
  //           discountPercentage: productData.discountPercentage,
  //           availabilityStatus: productData.availabilityStatus,
  //           createdAt: new Date().toISOString(),
  //         });
  //         if (productData.imageUrl) {
  //           this.uploadImage(productData.imageUrl);
  //         } else {
  //           this.saveProduct(this.productForm.value);
  //         }
  //       });
  //     },
  //     error: (error: any) => {
  //       console.error('Error al procesar el CSV: ', error);
  //       toast.error('Hubo un error al procesar el archivo CSV.', {
  //         position: 'top-right',
  //       });
  //     }
  //   });
  // }

  // uploadImage(imageUrl: string) {
  //   const filePath = `products/${imageUrl}`;
  //   const fileRef = this.storage.ref(filePath);
  //   const uploadTask = this.storage.upload(filePath, imageUrl);

  //   uploadTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       fileRef.getDownloadURL().subscribe((url) => {
  //         this.productForm.patchValue({ imageUrl: url });
  //         this.saveProduct(this.productForm.value);
  //       });
  //     })
  //   ).subscribe();
  // }
}