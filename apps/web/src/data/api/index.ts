export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
}

export interface Resource {
  id: number;
  title: string;
  content: string;
  category_id: number;
  user_id: number;
  status: 'pending' | 'validated' | 'suspended';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  resource_id: number;
  parent_id: number | null;
  created_at: string;
}