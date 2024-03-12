import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }

  //Esta función es para evitar que se recargue la página al hacer el submit
  handleSubmit(event: Event): void {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recargar la página)
    const emailInput = (event.target as HTMLFormElement).querySelector('#emailInput') as HTMLInputElement;
    const email = emailInput.value;
    this.sendEmail(email);
  }

  sendEmail(email: String){
    //Do something!
    console.log("Enviando link de inicio de sesión a: ", email);
  }
  discordLogin(){
    //Do something!
    console.log("Aquí  Paublo hace magia o algo");
  }
}
