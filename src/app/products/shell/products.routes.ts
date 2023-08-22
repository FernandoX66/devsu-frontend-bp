import { Routes } from '@angular/router';
import { ProductsListComponent } from '../features/products-list/products-list.component';
import { ProductsFormComponent } from '../features/products-form/products-form.component';

const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: ProductsFormComponent,
  },
  {
    path: ':id',
    component: ProductsFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default productsRoutes;
