export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean;
}

export interface CreateFAQRequest {
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
}
