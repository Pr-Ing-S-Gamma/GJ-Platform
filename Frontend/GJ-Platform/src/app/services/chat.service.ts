import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../../types';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';




@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

    private baseUrl = `http://${environment.apiUrl}:3000/api/chat/`;


    createChat(chat: Chat): Observable<any> {
      return this.http.post(this.baseUrl+'create-chat', chat, { withCredentials: true });
    }

    getChat(chat: Chat, id: string): Observable<any> {
      return this.http.get<any>(this.baseUrl+`get-chat/:${id}`, { withCredentials: true }).pipe(
        map(response => response.data))
    }
  
}
