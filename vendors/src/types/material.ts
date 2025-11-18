export interface Material {
  id: number;
  itemName: string;
  category: string;
  size: string;
  unit: string;
  price: number;
  image?: string | null;
  createdAt: Date;
  vendors?: string | null;
}
