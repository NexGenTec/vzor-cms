import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReviewCliente, CreateReviewRequest, UpdateReviewRequest } from '../models/review-clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewClientesService {
  private collection = 'review-clientes';

  constructor(private firestore: Firestore) {}

  // GET - Obtener todas las reseñas
  getReviews(): Observable<ReviewCliente[]> {
    const reviewsCollection = collection(this.firestore, this.collection);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(reviewsCollection, (querySnapshot) => {
        const reviews = querySnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            ...data,
            id: +doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as ReviewCliente;
        });
        observer.next(reviews);
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener una reseña por ID
  getReview(id: number): Observable<ReviewCliente | undefined> {
    const reviewDoc = doc(this.firestore, this.collection, id.toString());
    return new Observable(observer => {
      const unsubscribe = onSnapshot(reviewDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;
          observer.next({
            ...data,
            id: +docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as ReviewCliente);
        } else {
          observer.next(undefined);
        }
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener una reseña por ID (alias)
  getReviewById(id: number): Observable<ReviewCliente | undefined> {
    return this.getReview(id);
  }

  // POST - Crear nueva reseña
  createReview(reviewData: CreateReviewRequest): Observable<void> {
    const newReview = {
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const reviewsCollection = collection(this.firestore, this.collection);
    return from(addDoc(reviewsCollection, newReview).then(() => {}));
  }

  // PUT - Actualizar reseña
  updateReview(id: number, reviewData: UpdateReviewRequest): Observable<void> {
    const reviewDoc = doc(this.firestore, this.collection, id.toString());
    return from(updateDoc(reviewDoc, {
      ...reviewData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar reseña
  deleteReview(id: number): Observable<void> {
    const reviewDoc = doc(this.firestore, this.collection, id.toString());
    return from(deleteDoc(reviewDoc));
  }
}