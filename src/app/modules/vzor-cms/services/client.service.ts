import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/client.model';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private collection = 'clients';

    constructor(private firestore: Firestore) { }

    getClients(): Observable<Client[]> {
        const clientsCollection = collection(this.firestore, this.collection);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(clientsCollection, (querySnapshot) => {
                const clients = querySnapshot.docs.map(doc => {
                    const data = doc.data() as any;
                    return {
                        ...data,
                        id: doc.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Client;
                });
                clients.sort((a, b) => a.order - b.order);
                observer.next(clients);
            }, (error) => observer.error(error));

            return () => unsubscribe();
        });
    }

    getClientById(id: string): Observable<Client | undefined> {
        const clientDoc = doc(this.firestore, this.collection, id);
        return new Observable(observer => {
            const unsubscribe = onSnapshot(clientDoc, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as any;
                    observer.next({
                        ...data,
                        id: docSnapshot.id,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
                    } as Client);
                } else {
                    observer.next(undefined);
                }
            }, (error) => observer.error(error));

            return () => unsubscribe();
        });
    }

    createClient(clientData: CreateClientRequest): Observable<void> {
        const newClient = {
            ...clientData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const clientsCollection = collection(this.firestore, this.collection);
        return from(addDoc(clientsCollection, newClient).then(() => { }));
    }

    updateClient(id: string, clientData: UpdateClientRequest): Observable<void> {
        const clientDoc = doc(this.firestore, this.collection, id);
        return from(updateDoc(clientDoc, {
            ...clientData,
            updatedAt: new Date()
        }));
    }

    deleteClient(id: string): Observable<void> {
        const clientDoc = doc(this.firestore, this.collection, id);
        return from(deleteDoc(clientDoc));
    }
}
