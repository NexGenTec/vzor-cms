export interface Solution {
    id: string;
    title: string;
    description: string;
    features: string[];
    iconUrl?: string;
    order: number;
}

export interface Platform {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    order: number;
    isActive: boolean;
    solutions: Solution[];
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean;
}

export interface CreatePlatformRequest {
    name: string;
    description: string;
    iconUrl: string;
    order: number;
    isActive: boolean;
    solutions: Solution[];
}

export interface UpdatePlatformRequest extends Partial<CreatePlatformRequest> {
}
