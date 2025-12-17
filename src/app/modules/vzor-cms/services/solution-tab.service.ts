import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { SolutionTab, CreateSolutionTabRequest, UpdateSolutionTabRequest } from '../models/solution-tab.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionTabService {
  private collectionName = 'solutionTabs';

  constructor(private firestore: Firestore) { }

  getSolutionTabs(): Observable<SolutionTab[]> {
    const tabsCollection = collection(this.firestore, this.collectionName);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(tabsCollection, (querySnapshot) => {
        const tabs = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data() as any;
          return {
            ...data,
            id: docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as SolutionTab;
        });

        observer.next(tabs);
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  getSolutionTabById(id: string): Observable<SolutionTab | undefined> {
    const tabDoc = doc(this.firestore, this.collectionName, id);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(tabDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;
          observer.next({
            ...data,
            id: docSnapshot.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
          } as SolutionTab);
        } else {
          observer.next(undefined);
        }
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  createSolutionTab(tabData: CreateSolutionTabRequest): Observable<void> {
    const newTab = {
      ...tabData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tabsCollection = collection(this.firestore, this.collectionName);
    return from(addDoc(tabsCollection, newTab).then(() => { }));
  }

  updateSolutionTab(id: string, tabData: UpdateSolutionTabRequest): Observable<void> {
    const tabDoc = doc(this.firestore, this.collectionName, id);
    return from(updateDoc(tabDoc, {
      ...tabData,
      updatedAt: new Date()
    }));
  }

  deleteSolutionTab(id: string): Observable<void> {
    const tabDoc = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(tabDoc));
  }
}


