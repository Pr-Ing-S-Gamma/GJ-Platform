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
  
    if (this.team !== undefined && this.localOrg !== undefined) {
      this.chatService.getChatbyParticipants([this.localOrg , this.team]).subscribe(
        (chat: Chat) => {
          this.chat = chat;
        },
        (error: any) => {
          const newChat: Chat = {
            _id: '',
            participants: [
              { participantType: 'User', participantId: this.localOrg! },
              { participantType: 'Team', participantId: this.team! }
            ],
            messagesList: []
          };
          console.log(newChat.participants)
          this.chatService.createChat(newChat).subscribe(
            (createdChat: Chat) => {
              this.chat = createdChat;
            },
            (createError: any) => {
              console.error('Error creating chat:', createError);
            }
          );
        }
      );
    } else {
      console.error('team or localOrg is undefined');
    }
  }

  sendMSG() {
  if (this.myForm.valid) {
    const sender = { Id: this.team,  Type: 'User' }; // Suponiendo que el remitente es un usuario
    const msg = this.myForm.get('msg')!.value; // Obtener el mensaje del formulario

    this.chatService.sendMessage(this.chat!, this.chat!._id).subscribe(
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
