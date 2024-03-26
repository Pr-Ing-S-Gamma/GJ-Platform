import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http: HttpClient) { }

  getSites(url: string): Observable<Site[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  getSitesPerRegion(url: string): Observable<Site[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
}
