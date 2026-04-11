export type MockCategory = { id: number; name: string };
export type MockResourceType = { id: number; name: string };
export type MockRelationType = { id: number; name: string };

export type MockResourceListItem = {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category?: MockCategory;
  resource_type?: MockResourceType;
  relation_type?: MockRelationType;
  created_at: string;
};

export type MockResourceDetail = MockResourceListItem & {
  status: string;
  is_public: boolean;
  user?: { id: number; name: string };
};

export type MockComment = {
  id: number;
  content: string;
  created_at: string;
  user?: { id: number; name: string };
  replies?: MockComment[];
};

export type MockProgressionRow = {
  resource_id?: number;
  resource?: { id: number; title: string; content?: string };
};
