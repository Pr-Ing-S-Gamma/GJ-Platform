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

  private baseUrl = `http://${environment.apiUrl}:3000/api/chat/`;

  constructor(private http: HttpClient) {}

  createChat(chat: Chat): Observable<any> {
    return this.http.post(`${this.baseUrl}create-chat`, chat.participants, { withCredentials: true });
  }

  getChat(id: string): Observable<Chat> {
    return this.http.get<{ data: Chat }>(`${this.baseUrl}get-chat/${id}`, { withCredentials: true }).pipe(
      map(response => response.data)
    );
  }

  getChatbyParticipants(participantIds: string[]): Observable<Chat> {
    return this.http.post<{ data: Chat }>(`${this.baseUrl}get-chat-by-participants`, { participantIds }, { withCredentials: true }).pipe(
      map(response => response.data)
    );
  }

  sendMessage(chat: Chat, id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}send-chat/${id}`, chat.messagesList, { withCredentials: true });
  }
}
