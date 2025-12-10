export interface FAQ {
    id: string;
    title: string;
    subtitle: string;
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
    title: string;
    subtitle: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
}
