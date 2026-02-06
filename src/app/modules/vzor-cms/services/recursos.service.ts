import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recurso, CreateRecursoRequest, UpdateRecursoRequest } from '../models/recursos.model';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  private collection = 'recursos';

  constructor(private firestore: Firestore) {}

  // GET - Obtener todos los recursos
  getRecursos(): Observable<Recurso[]> {
    const recursosCollection = collection(this.firestore, this.collection);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(recursosCollection, (querySnapshot) => {
        const recursos = querySnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            ...data,
            id: +doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as Recurso;
        });
        observer.next(recursos);
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener un recurso por ID
  getRecurso(id: number): Observable<Recurso | undefined> {
    const recursoDoc = doc(this.firestore, this.collection, id.toString());
    return new Observable(observer => {
      const unsubscribe = onSnapshot(recursoDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;
          observer.next({
            ...data,
            id: +docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as Recurso);
        } else {
          observer.next(undefined);
        }
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener un recurso por ID (alias)
  getRecursoById(id: number): Observable<Recurso | undefined> {
    return this.getRecurso(id);
  }

  // POST - Crear nuevo recurso
  createRecurso(recursoData: CreateRecursoRequest): Observable<void> {
    const newRecurso = {
      ...recursoData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const recursosCollection = collection(this.firestore, this.collection);
    return from(addDoc(recursosCollection, newRecurso).then(() => {}));
  }

  // PUT - Actualizar recurso
  updateRecurso(id: number, recursoData: UpdateRecursoRequest): Observable<void> {
    const recursoDoc = doc(this.firestore, this.collection, id.toString());
    return from(updateDoc(recursoDoc, {
      ...recursoData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar recurso
  deleteRecurso(id: number): Observable<void> {
    const recursoDoc = doc(this.firestore, this.collection, id.toString());
    return from(deleteDoc(recursoDoc));
  }
}