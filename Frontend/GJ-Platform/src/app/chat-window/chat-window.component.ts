import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
  chat: any[] = [
    {
      name: "Rodolfo",
      rol: "LocalOrganizer",
      time: "idk",
      msg: "Suban el juego"
    },{
      name: "David",
      rol: "Jammer",
      time: "LAs 4 en punta",
      msg: "Lorem ipsum sit dolor amet, lorem ipsum sit dolor amet, lorem ipsum sit dolor amet, lorem ipsum sit dolor aemt, lorem ipsum sit dolor amet, lorem ipsum sit dolor amet."
    }
  ];
  constructor(private fb: FormBuilder){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      msg: ['', Validators.required]
    });
  }

  sendMSG(){
    if (this.myForm.valid) {
      var msg = this.myForm.value["msg"];
      this.chat.push({
        name: "David",
        rol: "Jammer",
        time: "LAs 4 en punta",
        msg: msg
      })
      this.myForm.reset();
    }
  }
}
