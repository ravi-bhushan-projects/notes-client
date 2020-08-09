import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { UserDetails } from './user-details.model';
import { Router } from '@angular/router';
import { catchError, concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private userDetails: UserDetails;

  constructor(private httpClient: HttpClient, private router: Router) {}

  attemptLogin(userData): void {
    this.httpClient
      .post('/api/v1/authenticate', userData)
      .pipe(concatMap(() => this.fetchUserDetails()))
      .subscribe((userDetails) => {
        this.authSuccessful(userDetails);
        this.router.navigate(['/']);
      });
  }

  fetchUserDetails(): Observable<UserDetails> {
    return this.httpClient.get<UserDetails>('/api/v1/user');
  }

  isUserLoggedIn(): Observable<boolean> {
    if (this.userDetails) {
      return of(true);
    } else {
      return this.fetchUserDetails().pipe(
        map(
          (userDetails) => {
            this.authSuccessful(userDetails);
            return true;
          },
          catchError(() => of(false))
        )
      );
    }
  }

  logout(): void {
    this.httpClient.get('/api/v1/user/logout').subscribe(() => {
      this.userDetails = null;
      this.authChange.next(false);
      this.router.navigate(['/login']);
    });
  }

  private authSuccessful(userDetails: UserDetails): void {
    this.userDetails = userDetails;
    this.authChange.next(true);
  }
}
