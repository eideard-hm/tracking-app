import type { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@environments/environment';

export const mapboxTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cloneRequest = req.clone({
    params: req.params.appendAll({
      language: 'es',
      access_token: environment.mapboxAccessToken,
    }),
  });
  return next(cloneRequest);
};
