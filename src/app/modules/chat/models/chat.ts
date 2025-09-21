export interface ChatMessage {
    id: string; // Autogenerado por Firestore
    userId: string; // ID del usuario que envió el mensaje
    userName: string; // Nombre del usuario que envió el mensaje
    content: string; // Contenido del mensaje
    senderId:string,
    senderName:string;
    message: string; // Contenido del mensaje
    timestamp: string; // Fecha y hora del mensaje (como cadena ISO 8601)
    sentBy: 'me' | 'them'; // Quién envió el mensaje
    text: string; // Texto del mensaje
}

export interface ChatRoom {
    id: string;
    name?: string;
    createdAt: Date | string;
    members?: string[];
    status?: 'active' | 'archived';
    userImage?: string;
    userName?: string;
    messages: ChatMessage[];
}
