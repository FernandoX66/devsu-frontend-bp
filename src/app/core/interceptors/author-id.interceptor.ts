import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const authorIdInterceptor: HttpInterceptorFn = (req, next) => {
  const AUTHOR_ID = environment.authorId;
  const clonedRequest = req.clone({
    headers: req.headers.set('authorId', AUTHOR_ID),
  });

  return next(clonedRequest);
};
