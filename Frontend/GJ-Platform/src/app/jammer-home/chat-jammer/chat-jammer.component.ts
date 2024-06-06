import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Chat } from '../../../types';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-jammer',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat-jammer.component.html',
  styleUrl: './chat-jammer.component.css'
})
export class ChatJammerComponent implements OnInit{
  myForm!: FormGroup;
  @Input() team: string | undefined;
  chat: Chat | undefined;
  constructor(private fb: FormBuilder, private chatService :ChatService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      message: ['', Validators.required]
    });
    if (this.team) {
    this.chatService.getJammerChat(this.team).subscribe(
      (chat: Chat) => {
        this.chat = chat;
        console.log('Chat obtenido:', chat);
      },
      (error: any) => {
        alert("No hay chats disponibles");
      }
    );
  }
}
  sendMSG() {
    if (this.myForm.valid) {
        const sender = { Id: this.team, Type: 'Team' }; 
        const msg = this.myForm.get('message')!.value;

        this.chatService.sendMessage(this.chat!._id, sender, msg).subscribe(
            (response: any) => {
                console.log('Mensaje enviado con éxito:', response);
            },
            (error: any) => {
                console.error('Error al enviar el mensaje:', error);
            }
        );
        this.myForm.reset();
    }
  }
}
