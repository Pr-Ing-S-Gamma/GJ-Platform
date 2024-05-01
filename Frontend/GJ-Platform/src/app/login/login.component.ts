import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
    .subscribe(
      user => {
        if (user.rol === 'LocalOrganizer') {
          this.router.navigate(['/Games']);
        }
        if (user.rol === 'GlobalOrganizer') {
          this.router.navigate(['/DataManagement']);
        }
        if (user.rol === 'Judge') {
          this.router.navigate(['/Juez']);
        }
      },
      () => {
      }
    );
  }
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  //Esta función es para evitar que se recargue la página al hacer el submit
  handleSubmit(event: Event): void {
    event.preventDefault(); // Evita la acción predeterminada del formulario (recargar la página)
    const emailInput = (event.target as HTMLFormElement).querySelector('#emailInput') as HTMLInputElement;
    const email = emailInput.value;
    this.sendEmail(email);
  }

  sendEmail(email: string): void {
    const url = 'http://localhost:3000/api/user/login-user';
    this.userService.loginUser(url, email).subscribe(
      response => {
        this.successMessage = `Link de inicio de sesión enviado a: ${response.email}`;
        this.showSuccessMessage = true;
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }

  closePopup(): void {
    this.showSuccessMessage = false;
  }
  
}
