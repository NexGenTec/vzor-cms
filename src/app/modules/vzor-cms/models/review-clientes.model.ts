export interface ReviewCliente {
  id: number;
  clientName: string;
  project: string;
  rating: number;
  review: string;
  projectType: string;
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

export interface CreateReviewRequest {
  clientName: string;
  project: string;
  rating: number;
  review: string;
  projectType: string;
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {
}