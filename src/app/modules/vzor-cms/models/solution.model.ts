export interface SolutionItem {
  id: string;
  /** Nombre corto de la solución, por ejemplo: "Brain Monitor" */
  name: string;
  /** Título de sección visible, por ejemplo: "VZOR®️ Brain Monitor" */
  sectionTitle: string;
  /** Subtítulo breve para contextualizar la solución */
  subtitle: string;
  /** Descripción corta para listados y cards */
  shortDescription: string;
  /**
   * Clave o identificador de la imagen (se usará en el sitio público
   * para mapear a un asset real: ej. "brainMonitorHero")
   */
  imgKey: string;
  /** Orden de aparición en los listados */
  order: number;
  /** Publicación en el sitio (true = visible, false = oculto) */
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

export interface CreateSolutionItemRequest {
  name: string;
  sectionTitle: string;
  subtitle: string;
  shortDescription: string;
  imgKey: string;
  order: number;
  isPublished: boolean;
}

export interface UpdateSolutionItemRequest extends Partial<CreateSolutionItemRequest> {
}


