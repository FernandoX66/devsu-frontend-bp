import { Routes } from '@angular/router';
import { ProductsService } from './products/data-access/services/products.service';
import { ProductsFacade } from './products/domain/products-facade.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./products/shell/products.routes'),
    providers: [ProductsService, ProductsFacade],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
