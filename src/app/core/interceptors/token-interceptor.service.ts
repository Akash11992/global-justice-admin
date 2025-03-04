import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private _sharedService : SharedService, private _router: Router, private _ngxLoader : NgxUiLoaderService) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    if (this._sharedService.getJWTToken() !== null) {
      const jwtTokenHeader = {
        'Authorization': 'Bearer ' + this._sharedService.getJWTToken()
      };
      const reqWithHeader = request.clone({
        setHeaders: jwtTokenHeader
      });
      return next.handle(reqWithHeader).pipe(
        catchError((err: HttpErrorResponse) => {
          console.log('Error caught:', err);
          if ([401, 403, 503].includes(err.status)) {
            console.log("Redirecting to login page");
            this._router.navigate(['/login']);
          } else if (err.error !== null) {
            console.log("Interceptor error:", err);
            this._ngxLoader.stop();
            this._sharedService.isLoading = false ;
            this._sharedService.ToastPopup(err.error.message, '', 'error');
          } else {
            this._sharedService.ToastPopup(err.message, err.statusText, 'error');
            this._sharedService.isLoading = false ;

          }
          return EMPTY;
        }),
        finalize(() => {
          // Finalize logic here if needed
        })
      );
    } else {
      return next.handle(request);
    }
}
}
