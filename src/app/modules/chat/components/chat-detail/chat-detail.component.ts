import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../management/service/user.service';
import { ChatService } from '../../service/chat.service';
import { AuthService } from '../../../auth/service/auth.service';
import { ChatRoom } from '../../models/chat';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {

  @Input() chatId!: string;
  @Input() user!: { name: string, image?: string };
  chatRoom: ChatRoom | null = null;
  @Output() chatClosed = new EventEmitter<void>();
  message: string = ''; 

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.chatId) {
      this.loadChatDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && this.chatId) {
      this.loadChatDetails();
    }
  }

  private loadChatRommDetails(): void {
    this.chatService.getChatById(this.chatId).subscribe((chatRoom) => {
      if (chatRoom) {
        this.chatRoom = chatRoom;
        console.log('chatRoom:', this.chatRoom); // Check chatRoom data
      } else {
        console.error('Chat no encontrado');
      }
    });
  }

  private loadChatDetails(): void {
    // Obtiene los detalles del chat, incluyendo los mensajes
    this.chatService.getChatMessages(this.chatId).subscribe((messages) => {
      if (messages) {
        // Verifica si el chat ya existe y actualiza solo los mensajes
        if (this.chatRoom) {
          this.chatRoom = {
            ...this.chatRoom,
            messages: messages,
          };
        } else {
          this.chatRoom = { 
            id: '', 
            messages, 
            createdAt: new Date().toISOString()
          };
        }        
        console.log('Mensajes cargados:', this.chatRoom?.messages); // Verifica los mensajes en consola
      } else {
        console.error('No se encontraron mensajes para este chat');
      }
    });
  }
  

  closeChat(): void {
    this.chatClosed.emit(); // Emitir evento de cierre
  }

  sendMessage(): void {
    // Ensure the message is not empty
    if (this.message.trim()) {
      const currentUser = this.authService.getUser(); // You need to implement this in your AuthService
      const userId = currentUser?.uid; // or however you store the user's ID
      const userName = this.user.name;
      const userImage = this.user.image || ''; // Default to empty string if no image

      if (userId) {
        // Send the message
        this.chatService.sendMessage(
          this.chatId,
          this.message,
          userId,
          userName,
        ).subscribe({
          next: (sentMessage) => {
            console.log('Message sent:', sentMessage);
            this.message = '';  // Clear message input after sending
            this.loadChatRommDetails();  // Reload chat to include the new message
            this.loadChatDetails
          },
          error: (error) => {
            console.error('Error sending message:', error);
          }
        });
      }
    }
  }
}