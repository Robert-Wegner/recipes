export type Recipe = {
    id: string; // unique id for routing
    title: string;
    author?: string;
    dateCreated?: string; // ISO string (use Date when needed)
    referenceUrl?: string[];
    imageUrl?: string;
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    remarks?: string;
    tags?: string[];
  };
  