export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ComponentItem {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  previewImageUrl: string;
  designType?: "Wireframe" | "UI Design";
  pricingType?: "Free" | "Pro";
  figmaDataBase64?: string;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComponentResponse {
  items: ComponentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthPayload {
  token: string;
  user: User;
}
