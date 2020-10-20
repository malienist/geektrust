import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Default interceptor that handles all API requests & responses
 */
@Injectable({
    providedIn: 'root'
})
export class AppHttpInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const geekTrustToken = localStorage.getItem('apiToken');
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        // append token in request header, only when submitting results
        (geekTrustToken && req.url.includes('.com/find'))
            && (headers = headers.append('token', geekTrustToken));
        const authorizedRequest = req.clone({
            headers: headers
        });
        return next.handle(authorizedRequest).pipe(
            catchError(this.handleAppError.bind(this))
        );
    }

    /**
     * Default API error handler for all API calls
     * @param error Error object sent from API
     */
    handleAppError(error): ObservableInput<any> {
        error?.error && console.error(`Error! - ${JSON.stringify(error, null, 3)}`);
        return throwError(error);
    }
}
