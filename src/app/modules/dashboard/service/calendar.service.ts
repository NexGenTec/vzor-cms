import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../models/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private readonly collectionName = 'Calendar';

  constructor(private firestore: AngularFirestore) { }

  createEvent(event: CalendarEvent): Promise<void> {
    const eventId = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(eventId).set({
      ...event,
      id: eventId,
      fecha: event.fecha.toISOString(),
    });
  }

  // Obtener todos los eventos
  getAllEvents(): Observable<CalendarEvent[]> {
    return this.firestore.collection<CalendarEvent>(this.collectionName, ref => ref.orderBy('fecha')).valueChanges();
  }

  // Obtener un evento específico por ID
  getEventById(eventId: string): Observable<CalendarEvent | undefined> {
    return this.firestore.collection<CalendarEvent>(this.collectionName).doc(eventId).valueChanges();
  }

  // Actualizar un evento
  updateEvent(eventId: string, event: CalendarEvent): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(eventId).update({
      ...event,
      fecha: event.fecha.toISOString(),
    });
  }

  // Eliminar un evento
  deleteEvent(eventId: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(eventId).delete();
  }
}
