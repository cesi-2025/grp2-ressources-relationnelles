export interface Resource {
  id: number;
  title: string;
  content: string;
  category_id: number;
  relation_type_id: number;
  resource_type_id: number;
  user_id: number;
  status: 'published' | 'validated' | 'archived';
  is_public: boolean;
  created_at: string;
}

export interface ResourceType {
  id: number;
  name: string;
}
 