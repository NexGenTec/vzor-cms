import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '../models/partner.model';

@Injectable({
    providedIn: 'root'
})
export class PartnerService {
    private collection = 'partners';

    constructor(private firestore: Firestore) { }

    getPartners(): Observable<Partner[]> {
        const partnersCollection = collection(this.firestore, this.collection);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(partnersCollection, (querySnapshot) => {
                const partners = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        ...data,
                        id: doc.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Partner;
                });
                partners.sort((a, b) => a.order - b.order);
                observer.next(partners);
            }, (error) => observer.error(error));

            return () => unsubscribe();
        });
    }

    getPartnerById(id: string): Observable<Partner | undefined> {
        const partnerDoc = doc(this.firestore, this.collection, id);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(partnerDoc, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as any;
                    observer.next({
                        ...data,
                        id: docSnapshot.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Partner);
                } else {
                    observer.next(undefined);
                }
            }, (error) => observer.error(error));

            return () => unsubscribe();
        });
    }

    createPartner(partnerData: CreatePartnerRequest): Observable<void> {
        const newPartner = {
            ...partnerData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const partnersCollection = collection(this.firestore, this.collection);
        return from(addDoc(partnersCollection, newPartner).then(() => { }));
    }

    updatePartner(id: string, partnerData: UpdatePartnerRequest): Observable<void> {
        const partnerDoc = doc(this.firestore, this.collection, id);
        return from(updateDoc(partnerDoc, {
            ...partnerData,
            updatedAt: new Date()
        }));
    }

    deletePartner(id: string): Observable<void> {
        const partnerDoc = doc(this.firestore, this.collection, id);
        return from(deleteDoc(partnerDoc));
    }
}
