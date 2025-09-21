export interface Task {
    id: string; // Identificador único de la tarea
    title: string; // Título de la tarea
    selected: boolean;
    description: string; // Descripción de la tarea (opcional)
    completed: boolean; // Estado de la tarea (completada o no)
    priority: 'Baja' | 'Media' | 'Alta'; // Prioridad de la tarea (opcional)
    dueDate: string; // Fecha límite de la tarea (opcional)
    createdAt: string; // Fecha de creación de la tarea
    assignedTo: string;
    tags: string[];
    uid: string;
}

// export interface Task {
//     id?: string; // Identificador único de la tarea
//     title: string; // Título de la tarea
//     description: string; // Descripción detallada de la tarea
//     completed: boolean; // Estado de la tarea (completada o no)
//     priority: 'Baja' | 'Media' | 'Alta' | 'Crítica'; // Prioridad de la tarea
//     dueDate?: string; // Fecha límite de la tarea
//     createdAt: string; // Fecha de creación de la tarea
//     updatedAt?: string; // Fecha de la última actualización de la tarea
//     assignedTo?: string; // Persona o equipo asignado a la tarea
//     tags?: string[]; // Etiquetas asociadas a la tarea
//     selected?: boolean; // Indica si la tarea está seleccionada en el contexto actual
//     status: 'Pendiente' | 'En Proceso' | 'Bloqueada' | 'Completada'; // Estado de progreso de la tarea
//     subtasks?: Subtask[]; // Lista de subtareas asociadas a esta tarea
//     estimatedTime?: number; // Tiempo estimado para completar la tarea (en horas)
//     actualTimeSpent?: number; // Tiempo real dedicado a la tarea (en horas)
//     attachments?: Attachment[]; // Lista de archivos adjuntos relacionados con la tarea
//     comments?: Comment[]; // Lista de comentarios relacionados con la tarea
//     visibility: 'Pública' | 'Privada'; // Define si la tarea es visible para otros
//     relatedTasks?: string[]; // Lista de IDs de tareas relacionadas
//     recurrence?: Recurrence; // Configuración para tareas recurrentes
// }

// // Subinterfaz para subtareas
// export interface Subtask {
//     id?: string; // Identificador único de la subtarea
//     title: string; // Título de la subtarea
//     completed: boolean; // Estado de la subtarea (completada o no)
//     dueDate?: string; // Fecha límite de la subtarea
// }

// // Subinterfaz para archivos adjuntos
// export interface Attachment {
//     id?: string; // Identificador único del archivo
//     name: string; // Nombre del archivo
//     url: string; // URL del archivo
//     uploadedAt: string; // Fecha de subida del archivo
// }

// // Subinterfaz para comentarios
// export interface Comment {
//     id?: string; // Identificador único del comentario
//     author: string; // Autor del comentario
//     content: string; // Contenido del comentario
//     createdAt: string; // Fecha de creación del comentario
// }

// // Subinterfaz para recurrencia
// export interface Recurrence {
//     frequency: 'Diaria' | 'Semanal' | 'Mensual' | 'Anual'; // Frecuencia de recurrencia
//     endDate?: string; // Fecha de finalización de la recurrencia
// }
