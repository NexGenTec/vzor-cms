import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatRoom } from '../../models/chat';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../management/service/user.service';
import { User } from '../../../management/models/user';
import { AuthService } from '../../../auth/service/auth.service';
import { ChatService } from '../../service/chat.service';
import { combineLatest, from } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  @Output() chatSelected: EventEmitter<{ chatId: string, user: User }> = new EventEmitter();

  currentUser!: User;
  users: User[] = [];
  chatRooms: ChatRoom[] = [];
  archivedChatRooms: ChatRoom[] = [];
  loadingUsers = true;
  loadingChats = true;
  loadingArchivedChats = true; 
  selectedChatId: string | null = null;  // Nueva propiedad para almacenar el chat seleccionado
  selectedUserData: User | null = null; 
  @Output() chatClosed = new EventEmitter<void>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.loadAllData();
      }
    });
  }

  /**
   * Carga los usuarios, chats activos y archivados, y actualiza las listas
   */
  private loadAllData(): void {
    combineLatest([
      this.chatService.getUserChats(this.currentUser.uid),
      this.chatService.getArchivedChats(this.currentUser.uid),
      this.userService.getAllUsers()
    ]).subscribe(([chats, archivedChats, users]) => {
      this.chatRooms = chats;
      this.archivedChatRooms = archivedChats;
  
      const allChatUserIds = [
        ...this.chatRooms.flatMap(chat => chat.members),
        ...this.archivedChatRooms.flatMap(chat => chat.members)
      ];
  
      this.users = users.filter(
        (u) => u.uid !== this.currentUser.uid && !allChatUserIds.includes(u.uid)
      );
  
      this.loadingChats = false;
      this.loadingArchivedChats = false;
      this.loadingUsers = false;
    });
  }

  /**
   * Selecciona un usuario para iniciar un chat
   */
  selectUser(user: User): void {
    const confirmChat = confirm(`¿Quieres iniciar un chat con ${user.name}?`);
    if (!confirmChat) return;
  
    this.userService.getUserData(user.uid).subscribe((userData) => {
      from(this.chatService.getOrCreateChatRoom(this.currentUser.uid, user.uid, userData.image || '', userData.name))
        .subscribe({
          next: (chatRoom) => {
            if (chatRoom && chatRoom.id) {  // Verificamos que chatRoom tenga un id
              const newChatRoom: ChatRoom = {
                id: chatRoom.id,
                members: chatRoom.members,
                name: chatRoom.name,
                createdAt: '', // Add the required property
                messages: [] // Add the required property
              };
              this.chatRooms.push(newChatRoom);
              this.updateAvailableUsers();
              this.chatSelected.emit({ chatId: chatRoom.id, user: userData });
            } else {
              console.error('El chat creado no tiene un ID válido:', chatRoom);
            }
          },
          error: (err) => {
            console.error('Error al crear el chat:', err);
          }
        });
    });
  }  

  /**
   * Actualiza la lista de usuarios disponibles
   */
  private updateAvailableUsers(): void {
    const allChatUserIds = [
      ...this.chatRooms.flatMap(chat => chat.members),
      ...this.archivedChatRooms.flatMap(chat => chat.members),
    ];
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users.filter(
        (u) => u.uid !== this.currentUser.uid && !allChatUserIds.includes(u.uid)
      );
    });
  }

  /**
   * Archiva un chat existente
   */
  archiveChat(chatId: string): void {
    this.chatService.archiveChat(chatId).subscribe(() => {
      this.loadAllData();
    });
  }

  /**
   * Elimina un chat existente
   */
  deleteChat(chatId: string): void {
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el chat?`);
    if (!confirmDelete) return;
  
    this.chatService.deleteChat(chatId).subscribe(() => {
      this.loadAllData();
      this.chatClosed.emit();
    });
  }  

  /**
   * Desarchiva un chat existente
   */
  unarchiveChat(chatId: string): void {
    this.chatService.unarchiveChat(chatId).subscribe(() => {
      this.loadAllData();
    });
  }

  /**
   * Selecciona un chat activo
   */
  /**
   * Selecciona un chat activo
   */
  selectChat(chatId: string): void {
    // Actualiza el chat seleccionado
    this.selectedChatId = chatId;
  
    // Busca los datos del chat usando el chatId
    this.chatService.getChatById(chatId).subscribe((chatRoom: ChatRoom | null) => {
      if (chatRoom) {  // Verificamos que chatRoom no sea null
        const userUid = chatRoom.members?.find(uid => uid !== this.currentUser.uid) || ''; // Default to empty string if undefined
        if (userUid) {
          this.userService.getUserData(userUid).subscribe((userData) => {
            this.chatSelected.emit({ chatId: chatRoom.id, user: userData });
          });
        } else {
          console.error('Usuario asociado al chat no encontrado o userUid es undefined.');
        }
      } else {
        console.error('No se encontró el chat con el ID proporcionado o el chat no tiene un ID válido:', chatId);
      }
    });
  }

}