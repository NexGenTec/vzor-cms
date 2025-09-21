export interface Product {
    id: string; // Identificador único del producto
    name: string; // Nombre del producto
    description: string; // Descripción del producto
    imageUrl: string; // URL de la imagen del producto
    category: string; // Categoría del producto
    price: number; // Precio del producto
    stock: number; // Cantidad disponible
    isActive: boolean; // Indica si el producto está activo
    selected?: boolean; // Indica si está seleccionado
    tags?: string[]; // Etiquetas asociadas
    createdAt: string; // Fecha de creación
    updatedAt?: string; // Fecha de la última actualización
    rating?: number; // Calificación promedio
    discountPrice: number | null;
    discountPercentage: number | null; 
    availabilityStatus?: "enStock" | "agotado" | "preOrden" | "descontinuado"; // Estado de disponibilidad
    uid?: string;
}
