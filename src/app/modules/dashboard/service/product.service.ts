import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Product } from '../models/product';
import { Observable, filter, from, map, switchMap } from 'rxjs';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collectionName = 'Products';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  addProduct(product: Product) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          product = { ...product, uid: user.uid };
          return this.firestore.collection<Product>(this.collectionName).add(product);
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getProducts() {
    return this.afAuth.authState.pipe(
      filter((user) => !!user),
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Product>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getProductById(productId: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Product>(this.collectionName)
            .doc(productId)
            .valueChanges();
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  updateProduct(productId: string, updatedProduct: Product) {
    return this.firestore
      .collection<Product>(this.collectionName)
      .doc(productId)
      .update(updatedProduct);
  }

  deleteProduct(productId: string) {
    return this.firestore
      .collection<Product>(this.collectionName)
      .doc(productId)
      .delete();
  }

  deleteSelectedProducts(productIds: string[]): Observable<void> {
    return from(this.afAuth.authState).pipe(
      filter(user => !!user),
      switchMap(() => {
        const batch = this.firestore.firestore.batch();
        productIds.forEach(productId => {
          const docRef = this.firestore.collection(this.collectionName).doc(productId).ref;
          batch.delete(docRef);
        });
        return from(batch.commit());
      })
    );
  }  

  addMultipleProducts(products: Product[]): Observable<any> {
    return this.afAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => {
        const batch = this.firestore.firestore.batch();
        const collectionRef = this.firestore.collection(this.collectionName).ref;
  
        products.forEach((product) => {
          const docRef = collectionRef.doc();
          batch.set(docRef, { ...product, uid: user?.uid });
        });
  
        return from(batch.commit());
      })
    );
  }

  importProductsFromCSV(file: File): Observable<void> {
    return new Observable<void>((observer) => {
      this.afAuth.authState.pipe(
        switchMap((user) => {
          if (!user) {
            observer.error('Usuario no autenticado');
            return [];
          }
  
          return new Observable((innerObserver) => {
            Papa.parse(file, {
              complete: (result) => {
                const importedProducts: Product[] = result.data.map((row: any, index: number) => ({
                  id: this.firestore.createId(),
                  name: row[0] || `Producto ${index + 1}`,
                  description: row[1] || 'Sin descripción',
                  price: parseFloat(row[2]) || 0,
                  stock: parseInt(row[3], 10) || 0,
                  category: row[4] || 'Sin categoría',
                  imageUrl: row[5] || '',
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  rating: 0,
                  discountPrice: row[6] ? parseFloat(row[6]) : null,
                  discountPercentage: row[7] ? parseFloat(row[7]) : null,
                  availabilityStatus: 'enStock',
                  uid: user.uid,
                }));
  
                this.addMultipleProducts(importedProducts).subscribe({
                  next: () => {
                    innerObserver.next();
                    innerObserver.complete();
                  },
                  error: (err) => {
                    innerObserver.error(err);
                  },
                });
              },
              error: (err) => {
                innerObserver.error(err);
              },
            });
          });
        })
      ).subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }  

}