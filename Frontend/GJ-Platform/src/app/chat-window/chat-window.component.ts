import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Chat } from '../../types';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit{
  myForm!: FormGroup;
  @Input() team: string | undefined;
  @Input() localOrg : string | undefined;
  chat: Chat | undefined;
  constructor(private fb: FormBuilder, private chatService :ChatService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      msg: ['', Validators.required]
    });
  
    console.log(this.team);
    console.log(this.localOrg);
  
    if (this.team && this.localOrg) {
      this.chatService.getChatbyParticipants([this.localOrg, this.team]).subscribe(
        (chat: Chat) => {
          this.chat = chat;
        },
        (error: any) => {
          if (error.status === 404) {
            const newChat: Chat = {
              _id: '',
              participants: [
                { participantType: 'User', participantId: this.localOrg },
                { participantType: 'Team', participantId: this.team }
              ],
              messagesList: []
            };
  
            this.chatService.createChat(newChat).subscribe(
              (createdChat: Chat) => {
                this.chat = createdChat;
              },
              (createError: any) => {
                console.error('Error creating chat:', createError);
              }
            );
          } else {
            console.error('Error fetching chat:', error);
          }
        }
      );
    } else {
      console.error('team or localOrg is undefined');
    }
  }
  sendMSG() {
    if (this.myForm.valid) {
        const sender = { Id: this.team, Type: 'User' }; // Suponiendo que el remitente es un usuario
        const msg = this.myForm.get('msg')!.value; // Obtener el mensaje del formulario

        this.chatService.sendMessage(this.chat!._id, sender, msg).subscribe(
            (response: any) => {
                console.log('Mensaje enviado con éxito:', response);
                // Aquí puedes hacer algo después de enviar el mensaje, si es necesario
            },
            (error: any) => {
                console.error('Error al enviar el mensaje:', error);
            }
        );
        this.myForm.reset();
    }
  }

}
