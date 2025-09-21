export interface Ticket {
    id: string; // ID único del ticket
    titulo: string; // Título breve del problema o solicitud
    selected?: boolean;
    descripcion: string; // Descripción detallada del problema
    categoria: string; // Categoría del ticket (e.g., "Soporte Técnico", "Consulta General")
    estado: 'Abierto' | 'En Proceso' | 'Cerrado'; // Estado actual del ticket
    prioridad: 'Baja' | 'Media' | 'Alta'; // Nivel de prioridad
    fechaCreacion: Date; // Fecha en la que se creó el ticket
    fechaCierre?: Date; // Fecha en la que se cerró el ticket, opcional
    usuarioSolicitante: string; // Nombre o ID del usuario que creó el ticket
    asignadoA?: string; // Nombre o ID del agente asignado al ticket
    comentarios?: Comentario[]; // Lista de comentarios relacionados con el ticket
    uid: string;
}

export interface Comentario {
    id: string; // ID único del comentario
    usuario: string; // Nombre o ID del usuario que realizó el comentario
    mensaje: string; // Contenido del comentario
    fecha: Date; // Fecha del comentario
}
