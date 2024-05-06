import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theme } from '../../types';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient) { }

  createTheme(url: string, theme: Theme): Observable<any> {
    return this.http.post(url, theme, { withCredentials: true });
  }

  updateTheme(url: string, theme: Theme): Observable<any> {
    return this.http.put(url, theme, { withCredentials: true });
  }
  
  getThemes(url: string): Observable<Theme[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  getTheme(url: string): Observable<Theme> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.theme)
    );
  }
  
  deleteTheme(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
