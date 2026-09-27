import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_URL } from './api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = typeof localStorage === 'undefined'
    ? null
    : localStorage.getItem('authToken');

  const isApiRequest = request.url.startsWith(`${API_BASE_URL}/api/`)
    || request.url.startsWith(`${API_BASE_URL}/delivery/`);

  if (!token || !isApiRequest) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  }));
};
