import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  createCategory(url: string, category: Category): Observable<any> {
    return this.http.post(url, category, { withCredentials: true });
  }

  updateCategory(url: string, category: Category): Observable<any> {
    return this.http.put(url, category, { withCredentials: true });
  }
  
  getCategories(url: string): Observable<Category[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  getCategory(url: string): Observable<Category> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  deleteCategory(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
