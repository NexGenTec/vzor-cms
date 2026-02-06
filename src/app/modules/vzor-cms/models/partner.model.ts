export interface Partner {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    website: string;
    order: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean;
}

export interface CreatePartnerRequest {
    name: string;
    description: string;
    logoUrl: string;
    website: string;
    order: number;
    isVisible: boolean;
}

export interface UpdatePartnerRequest extends Partial<CreatePartnerRequest> {
}
