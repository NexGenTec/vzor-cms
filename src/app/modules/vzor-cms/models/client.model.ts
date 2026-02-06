export interface Client {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    website: string;
    sector: string;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean;
}

export interface CreateClientRequest {
    name: string;
    description: string;
    logoUrl: string;
    website: string;
    sector: string;
    order: number;
    isPublished: boolean;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
}
