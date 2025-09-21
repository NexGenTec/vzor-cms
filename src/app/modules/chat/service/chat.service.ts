import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { ChatMessage, ChatRoom } from '../models/chat';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

    /**
   * Crea o devuelve un chat existente entre dos usuarios
   * @param userId1 ID del usuario actual
   * @param userId2 ID del usuario con quien se quiere chatear
   * @param userImage Imagen del usuario con quien se quiere chatear
   * @param userName Nombre del usuario con quien se quiere chatear
   */
      
    getOrCreateChatRoom(currentUserUid: string, otherUserUid: string, image: string, name: string) {
      // Realiza la creación o recuperación del chat y devuelve el observable
      return this.firestore.collection('chats').add({
        members: [currentUserUid, otherUserUid],
        image,
        name,
      }).then(docRef => {
        console.log('Nuevo chat creado con ID:', docRef.id); // Asegúrate de que el ID se esté generando correctamente
        return { id: docRef.id, members: [currentUserUid, otherUserUid], image, name };
      }).catch(err => {
        console.error('Error al crear el chat:', err);
        throw err;
      });
    }
    
  
    /**
     * Obtiene los mensajes de un chat
     * @param chatId ID del chat
     */
    getChatMessages(chatId: string): Observable<ChatMessage[]> {
      return this.firestore
        .collection<ChatMessage>(`chatRooms/${chatId}/messages`, ref =>
          ref.orderBy('timestamp', 'asc')
        )
        .valueChanges({ idField: 'id' });
    }
  
    /**
     * Envía un mensaje en un chat
     * @param chatId ID del chat
     * @param message Contenido del mensaje
     * @param senderId ID del remitente
     * @param senderName Nombre del remitente
     */
    sendMessage(chatId: string, message: string, senderId: string, senderName: string): Observable<void> {
      const messageData: Partial<ChatMessage> = {
        content: message,
        senderId: senderId,
        senderName: senderName,
        timestamp: new Date().toString()
      };
    
      return from(
        this.firestore.collection(`chatRooms/${chatId}/messages`).add(messageData)
      ).pipe(map(() => undefined));
    }
  
    /**
     * Archiva un chat
     * @param chatId ID del chat
     */
    archiveChat(chatId: string): Observable<void> {
      return from(
        this.firestore.doc(`chatRooms/${chatId}`).update({ archived: true })
      ).pipe(map(() => undefined));
    }
  
    /**
     * Desarchiva un chat
     * @param chatId ID del chat
     */
    unarchiveChat(chatId: string): Observable<void> {
      return from(
        this.firestore.doc(`chatRooms/${chatId}`).update({ archived: false })
      ).pipe(map(() => undefined));
    }
  
    /**
     * Elimina un chat
     * @param chatId ID del chat
     */
    deleteChat(chatId: string): Observable<void> {
      return from(
        this.firestore.doc(`chatRooms/${chatId}`).delete()
      ).pipe(map(() => undefined));
    }
  
    /**
     * Obtiene los chats de un usuario
     * @param userId ID del usuario
     */
    getUserChats(userId: string): Observable<ChatRoom[]> {
      return this.firestore
        .collection<ChatRoom>('chatRooms', ref =>
          ref.where('members', 'array-contains', userId).where('archived', '==', false)
        )
        .valueChanges({ idField: 'id' });
    }
  
    /**
     * Obtiene los chats archivados de un usuario
     * @param userId ID del usuario
     */
    getArchivedChats(userId: string): Observable<ChatRoom[]> {
      return this.firestore
        .collection<ChatRoom>('chatRooms', ref =>
          ref.where('members', 'array-contains', userId).where('archived', '==', true)
        )
        .valueChanges({ idField: 'id' });
    }
  
    /**
     * Obtiene los detalles de un chat por su ID
     * @param chatId ID del chat
     */
    getChatById(chatId: string): Observable<ChatRoom | null> {
      return this.firestore
        .doc<ChatRoom>(`chatRooms/${chatId}`)
        .valueChanges()
        .pipe(
          map(chatRoom => (chatRoom ? { ...chatRoom, chatId } : null))
        );
    }
  
}