import { Product } from '../data-access/models/product.model';

export const mockProducts: Product[] = [
  {
    id: 'test-id',
    name: 'test-name',
    description: 'test-description',
    logo: 'https://dummyimage.com/200x200/000/fff',
    date_release: '2021-01-01T00:00:00.000Z',
    date_revision: '2022-01-01T00:00:00.000Z',
  },
  {
    id: 'test-id-2',
    name: 'test-name-2',
    description: 'test-description-2',
    logo: 'https://dummyimage.com/200x200/000/fff',
    date_release: '2022-01-01T00:00:00.000Z',
    date_revision: '2023-01-01T00:00:00.000Z',
  },
];

export const mockProduct: Product = {
  id: 'test-id-3',
  name: 'test-name-3',
  description: 'test-description',
  logo: 'https://dummyimage.com/200x200/000/fff',
  date_release: '2019-01-01T00:00:00.000Z',
  date_revision: '2020-01-01T00:00:00.000Z',
};

export const mockProductFormValue = {
  id: 'test-id',
  name: 'test-name',
  description: 'test-description',
  logo: 'https://dummyimage.com/200x200/000/fff',
  date_release: '2000-01-01',
  date_revision: '2001-01-01',
};
