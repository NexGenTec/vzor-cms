import { Roles } from "../../auth/models/Roles.model";

export interface User {
  uid: string;        // ID único del usuario, proveniente de Firebase Authentication
  name: string;       // Nombre del usuario
  email: string;      // Correo electrónico del usuario
  createdAt: Date;    // Fecha de creación del usuario
  image?: string | null; // URL de la imagen de perfil del usuario
  Roles: Array<Roles>;    // Roles del usuario  
  selected?: boolean;
  status?: string;

  phoneNumber?: string; // Número de teléfono del usuario
  address?: string;     // Dirección del usuario
  lastLogin?: Date;     // Fecha y hora del último inicio de sesión
  profileVisibility?: boolean; // Indica si el perfil del usuario es visible públicamente
  birthday?: Date;      // Fecha de nacimiento del usuario
  preferences?: {       // Preferencias del usuario
    theme: string;      // Tema preferido
    notifications: boolean; // Configuración de notificaciones
  };
  language?: string;    // Idioma preferido por el usuario
  socialLinks?: {       // Enlaces a redes sociales
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  activityLog?: Array<{ action: string, date: Date }>; 
}