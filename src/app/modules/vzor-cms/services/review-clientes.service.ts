import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReviewCliente, CreateReviewRequest, UpdateReviewRequest } from '../models/review-clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewClientesService {
  private collection = 'review-clientes';

  constructor(private firestore: AngularFirestore) {}

  // GET - Obtener todas las reseñas
  getReviews(): Observable<ReviewCliente[]> {
    return this.firestore.collection<ReviewCliente>(this.collection).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ReviewCliente;
        const docId = a.payload.doc.id;
        return { ...data, id: +docId } as ReviewCliente;
      }))
    );
  }

  // GET - Obtener una reseña por ID
  getReview(id: number): Observable<ReviewCliente | undefined> {
    return this.firestore.doc<ReviewCliente>(`${this.collection}/${id}`).valueChanges();
  }

  // POST - Crear nueva reseña
  createReview(reviewData: CreateReviewRequest): Observable<void> {
    const id = Date.now();
    const newReview: ReviewCliente = {
      id,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(this.firestore.doc(`${this.collection}/${id}`).set(newReview));
  }

  // PUT - Actualizar reseña
  updateReview(id: number, reviewData: UpdateReviewRequest): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).update({
      ...reviewData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar reseña
  deleteReview(id: number): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).delete());
  }
}