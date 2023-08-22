import { Product } from '../../data-access/models/product.model';

export interface ProductsState {
  products: Product[];
  searchTerm: string;
  perPage: number;
  editProductId: Product['id'] | null;
}
