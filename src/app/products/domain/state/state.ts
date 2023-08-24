import { Product } from '../../data-access/models/product.model';

export interface ProductsState {
  products: Product[];
  isFiltering: boolean;
  filteredProductsIds: Product['id'][];
  editProductId: Product['id'] | null;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export const initialState: Readonly<ProductsState> = {
  products: [],
  filteredProductsIds: [],
  isFiltering: false,
  editProductId: null,
  loading: true,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
};
