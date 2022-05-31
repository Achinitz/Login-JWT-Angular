import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private router:Router) { }

  public sign(payload: { email:string, password: string }): Observable<any> {
    return this.http.post(`${this.url}/sign`, payload).pipe(
      //return this.http.post<{ token: string }>(`${this.url}/sign`, payload).pipe(
      map((data: any) =>{
          localStorage.setItem('access_token', JSON.stringify(data.token))
          console.log(data);
          return this.router.navigate(['admin']);
        },
        catchError(
          (err: any) => {
            return throwError(
              () => { err }
            );
          }
        )
        )
    );
  }

  public logout(){
    localStorage.removeItem('access_token');
    return this.router.navigate(['']);
  }

  public isAuthenticated(): boolean{
    const token = localStorage.getItem("access_token");

    if(!token){
      return false;
    }

    const jwtHelper = new JwtHelperService();

    return !jwtHelper.isTokenExpired(token);

  }

}
