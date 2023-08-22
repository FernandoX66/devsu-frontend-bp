import { Routes } from '@angular/router';
import { ProductsService } from './products/data-access/services/products.service';
import { ProductsFacade } from './products/domain/services/products-facade.service';
import { DateFacade } from './products/domain/services/date-facade.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./products/shell/products.routes'),
    providers: [ProductsService, ProductsFacade, DateFacade],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
