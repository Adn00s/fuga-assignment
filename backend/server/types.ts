
import { Request } from 'express';

export interface Product {
  id?: number;
  name: string;
  artist: string;
  coverArt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: number;
  email: string;
  username?: string;
  createdAt?: Date;
}

export interface APIResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface CreateProductRequest {
  name: string;
  artist: string;
  file?: Express.Multer.File;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  artist?: string;
  sortBy?: 'name' | 'artist' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
