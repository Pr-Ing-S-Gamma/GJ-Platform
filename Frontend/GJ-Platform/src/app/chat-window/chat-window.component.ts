import { Component, OnInit } from '@angular/core';
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
  team: string = "";
  localOrg : string = "";
  chat: Chat | undefined;
  constructor(private fb: FormBuilder, private chatService :ChatService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      msg: ['', Validators.required]
    });

    this.chatService.getChatbyParticipants([this.localOrg, this.team]).subscribe(
      (chat: Chat) => {
        this.chat = chat;
      },
      (error: any) => {
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
      }
    );
  }

  sendMSG(){
    if (this.myForm.valid) {
      this.myForm.reset();
    }
  }
}
