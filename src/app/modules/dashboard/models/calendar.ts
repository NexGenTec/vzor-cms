export interface CalendarEvent {
    id?: string;
    titulo: string;
    descripcion?: string;
    fecha: Date;
    hora: string;
    ubicacion?: string;
    tipo?: 'Reunión' | 'Recordatorio' | 'Evento' | 'Otro'; // Categoría del evento
    invitados?: string[]; // Lista de correos o nombres de invitados
    creadoPor?: string; // Usuario que creó el evento
    esRecurrente?: boolean; // Si el evento se repite
    frecuenciaRecurrencia?: 'Diaria' | 'Semanal' | 'Mensual' | 'Anual'; // Frecuencia si es recurrente
    colorEtiqueta?: string; // Para diferenciar eventos con colores
}
