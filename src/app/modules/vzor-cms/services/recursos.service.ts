import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recurso, CreateRecursoRequest, UpdateRecursoRequest } from '../models/recursos.model';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  private collection = 'recursos';

  constructor(private firestore: AngularFirestore) {}

  // GET - Obtener todos los recursos
  getRecursos(): Observable<Recurso[]> {
    return this.firestore.collection<Recurso>(this.collection).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Recurso;
        const docId = a.payload.doc.id;
        return { ...data, id: +docId } as Recurso;
      }))
    );
  }

  // GET - Obtener un recurso por ID
  getRecurso(id: number): Observable<Recurso | undefined> {
    return this.firestore.doc<Recurso>(`${this.collection}/${id}`).valueChanges();
  }

  // POST - Crear nuevo recurso
  createRecurso(recursoData: CreateRecursoRequest): Observable<void> {
    const id = Date.now();
    const newRecurso: Recurso = {
      id,
      ...recursoData,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(this.firestore.doc(`${this.collection}/${id}`).set(newRecurso));
  }

  // PUT - Actualizar recurso
  updateRecurso(id: number, recursoData: UpdateRecursoRequest): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).update({
      ...recursoData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar recurso
  deleteRecurso(id: number): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).delete());
  }

  // Incrementar descargas
  incrementDownloads(id: number): Observable<void> {
    // Obtener el recurso actual, incrementar downloads y actualizar
    return this.firestore.doc(`${this.collection}/${id}`).valueChanges().pipe(
      switchMap((recurso: any) => {
        if (recurso) {
          return from(this.firestore.doc(`${this.collection}/${id}`).update({
            downloads: (recurso.downloads || 0) + 1
          }));
        }
        return from(Promise.resolve());
      })
    );
  }
}
