import { Roles } from "./Roles.model";

export interface User {
  id: string;
  email: string;
  role: Roles;
  phoneNumber?: string;
  address?: string;
  createdAt?: Date;
  avatarUrl?: string;
  status?: 'active' | 'inactive' | 'suspended';
}