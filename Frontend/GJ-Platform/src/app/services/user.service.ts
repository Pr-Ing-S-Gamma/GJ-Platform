import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(url: string, user: User): Observable<any> {
    return this.http.post(url, user);
  }

  updateUser(url: string, user: User): Observable<any> {
    return this.http.put(url, user);
  }

  loginUser(url: string, email: string): Observable<any> {
    return this.http.post(url, { email });
  }

  logOutUser(url: string): Observable<any> {
    return this.http.get(url, { withCredentials: true });
  }

  getUsers(url: string): Observable<User[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  getCurrentUser(url: string): Observable<User> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  deleteUser(url: string): Observable<any> {
    return this.http.delete(url);
  }

  getLocalsSite(url: string): Observable<User[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }

  getJammersSite(url: string): Observable<User[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
}
