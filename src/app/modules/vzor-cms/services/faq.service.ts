import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { FAQ, CreateFAQRequest, UpdateFAQRequest } from '../models/faq.model';

@Injectable({
    providedIn: 'root'
})
export class FAQService {
    private collection = 'faqs';

    constructor(private firestore: Firestore) { }

    getFAQs(): Observable<FAQ[]> {
        const faqsCollection = collection(this.firestore, this.collection);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(faqsCollection, (querySnapshot) => {
                const faqs = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        ...data,
                        id: +doc.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as FAQ;
                });
                observer.next(faqs);
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    getFAQById(id: number): Observable<FAQ | undefined> {
        const faqDoc = doc(this.firestore, this.collection, id.toString());
        return new Observable(observer => {
            const unsubscribe = onSnapshot(faqDoc, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as any;
                    observer.next({
                        ...data,
                        id: +docSnapshot.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as FAQ);
                } else {
                    observer.next(undefined);
                }
            }, (error) => {
                observer.error(error);
            });

            return () => unsubscribe();
        });
    }

    createFAQ(faqData: CreateFAQRequest): Observable<void> {
        const newFAQ = {
            ...faqData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const faqsCollection = collection(this.firestore, this.collection);
        return from(addDoc(faqsCollection, newFAQ).then(() => { }));
    }

    updateFAQ(id: number, faqData: UpdateFAQRequest): Observable<void> {
        const faqDoc = doc(this.firestore, this.collection, id.toString());
        return from(updateDoc(faqDoc, {
            ...faqData,
            updatedAt: new Date()
        }));
    }

    deleteFAQ(id: number): Observable<void> {
        const faqDoc = doc(this.firestore, this.collection, id.toString());
        return from(deleteDoc(faqDoc));
    }
}
