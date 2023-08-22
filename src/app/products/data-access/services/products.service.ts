import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  private readonly BASE_URL = environment.baseUrl;
  private readonly http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.BASE_URL}/bp/products`);
  }

  createOneProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.BASE_URL}/bp/products`, product);
  }

  updateOneProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.BASE_URL}/bp/products`, product);
  }

  deleteOneProduct(id: Product['id']): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/bp/products`, {
      params: { id },
    });
  }

  checkExistence(id: Product['id']): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/bp/products/verification`, {
      params: { id },
    });
  }
}
