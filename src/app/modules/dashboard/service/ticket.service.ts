import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Ticket } from '../models/ticket';
import { filter, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private collectionName = 'Tickets';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  // Agregar un ticket asociado al usuario autenticado
  addTicket(ticket: Ticket) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          ticket = { ...ticket, uid: user.uid };
          return this.firestore.collection<Ticket>(this.collectionName).add(ticket);
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  // Obtener todos los tickets del usuario autenticado
  getTickets() {
    return this.afAuth.authState.pipe(
      filter((user) => !!user),
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Ticket>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getTicketById(ticketId: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Ticket>(this.collectionName)
            .doc(ticketId)
            .valueChanges();
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }



  // Actualizar un ticket
  updateTicket(ticketId: string, updatedTicket: Ticket) {
    return this.firestore
      .collection<Ticket>(this.collectionName)
      .doc(ticketId)
      .update(updatedTicket);
  }

  // Eliminar un ticket
  deleteTicket(ticketId: string) {
    return this.firestore
      .collection<Ticket>(this.collectionName)
      .doc(ticketId)
      .delete();
  }
}
