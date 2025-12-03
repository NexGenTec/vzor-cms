import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Platform, CreatePlatformRequest, UpdatePlatformRequest } from '../models/platform.model';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {
    private collection = 'platforms';

    constructor(private firestore: Firestore) { }

    getPlatforms(): Observable<Platform[]> {
        const platformsCollection = collection(this.firestore, this.collection);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(platformsCollection, (querySnapshot) => {
                const platforms = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        ...data,
                        id: doc.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Platform;
                });
                // Sort by order
                platforms.sort((a, b) => a.order - b.order);
                observer.next(platforms);
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    getPlatformById(id: string): Observable<Platform | undefined> {
        const platformDoc = doc(this.firestore, this.collection, id);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(platformDoc, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as any;
                    observer.next({
                        ...data,
                        id: docSnapshot.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Platform);
                } else {
                    observer.next(undefined);
                }
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    createPlatform(platformData: CreatePlatformRequest): Observable<void> {
        const newPlatform = {
            ...platformData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const platformsCollection = collection(this.firestore, this.collection);
        return from(addDoc(platformsCollection, newPlatform).then(() => { }));
    }

    updatePlatform(id: string, platformData: UpdatePlatformRequest): Observable<void> {
        const platformDoc = doc(this.firestore, this.collection, id);
        return from(updateDoc(platformDoc, {
            ...platformData,
            updatedAt: new Date()
        }));
    }

    deletePlatform(id: string): Observable<void> {
        const platformDoc = doc(this.firestore, this.collection, id);
        return from(deleteDoc(platformDoc));
    }
}
