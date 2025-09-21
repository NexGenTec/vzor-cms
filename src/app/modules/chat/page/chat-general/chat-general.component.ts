import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatDetailComponent } from '../../components/chat-detail/chat-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../management/models/user';

@Component({
  selector: 'app-chat-general',
  standalone: true,
  imports: [RouterModule, ChatListComponent, ChatDetailComponent, FormsModule, CommonModule],
  templateUrl: './chat-general.component.html',
  styleUrls: ['./chat-general.component.scss']
})
export class ChatGeneralComponent {
  selectedChatId: string = '';  // Chat seleccionado inicialmente vacío
  selectedUser: { name: string, image?: string } = { name: '' };

  onChatSelected(event: { chatId: string, user: User }): void {
    console.log('Chat seleccionado:', event);  // Verifica que el evento se recibe correctamente
    this.selectedChatId = event.chatId;
    
    // Asigna el valor de image asegurándote de que no sea null
    this.selectedUser = { 
      name: event.user.name, 
      image: event.user.image ?? undefined  // Asigna undefined si image es null
    };
  }

  handleChatClose(): void {
    this.selectedChatId = '';  // Resetea el chat seleccionado
    this.selectedUser = { name: '' };  // Opcional: También resetea el usuario seleccionado
  }  
}