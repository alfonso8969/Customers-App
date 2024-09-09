import {
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginService } from '../../auth/data-access/login.service';
import { inject } from '@angular/core';

// This interceptor will add an authentication token to each request made to the API.
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(LoginService).getToken();

  // Clone the request to add the authentication header.
  const newReq = request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + authToken),
    url: request.url + '?auth=' + authToken,
  });
  console.log("object authInterceptor: ", newReq);
  // Pass the cloned request to the next handler.
  return next(newReq).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(
          newReq.url,
          'returned a response with status',
          event.status
        );
      }
    })
  );
};
