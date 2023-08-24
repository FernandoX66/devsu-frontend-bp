import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { authorIdInterceptor } from './author-id.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('authorIdInterceptor', () => {
  let controller: HttpTestingController;
  let httpClient: HttpClient;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authorIdInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([interceptor])), provideHttpClientTesting()],
    });

    controller = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorId header to request', () => {
    httpClient.get('test-url').subscribe();

    const http = controller.expectOne('test-url');
    expect(http.request.headers.has('authorId')).toBeTrue();
  });
});
