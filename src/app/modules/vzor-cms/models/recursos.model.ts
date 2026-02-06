export interface Recurso {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

export interface CreateRecursoRequest {
  title: string;
  description: string;
  type: string;
  category: string;
}

export interface UpdateRecursoRequest extends Partial<CreateRecursoRequest> {
}