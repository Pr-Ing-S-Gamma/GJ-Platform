import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(url: string, user: User): Observable<any> {
    return this.http.post(url, user);
  }

  loginUser(url: string, email: string): Observable<any> {
    return this.http.post(url, { email });
  }
}
