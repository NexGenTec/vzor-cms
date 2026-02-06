import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { SolutionItem, CreateSolutionItemRequest, UpdateSolutionItemRequest } from '../models/solution.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  private collectionName = 'solutions';

  constructor(private firestore: Firestore) { }

  getSolutions(): Observable<SolutionItem[]> {
    const solutionsCollection = collection(this.firestore, this.collectionName);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(solutionsCollection, (querySnapshot) => {
        const solutions = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data() as any;
          return {
            ...data,
            id: docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as SolutionItem;
        });

        solutions.sort((a, b) => a.order - b.order);
        observer.next(solutions);
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  getSolutionById(id: string): Observable<SolutionItem | undefined> {
    const solutionDoc = doc(this.firestore, this.collectionName, id);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(solutionDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;
          observer.next({
            ...data,
            id: docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as SolutionItem);
        } else {
          observer.next(undefined);
        }
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  createSolution(solutionData: CreateSolutionItemRequest): Observable<void> {
    const newSolution = {
      ...solutionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const solutionsCollection = collection(this.firestore, this.collectionName);
    return from(addDoc(solutionsCollection, newSolution).then(() => { }));
  }

  updateSolution(id: string, solutionData: UpdateSolutionItemRequest): Observable<void> {
    const solutionDoc = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(solutionDoc, {
      ...solutionData,
      updatedAt: new Date()
    }));
  }

  deleteSolution(id: string): Observable<void> {
    const solutionDoc = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(solutionDoc));
  }
}


