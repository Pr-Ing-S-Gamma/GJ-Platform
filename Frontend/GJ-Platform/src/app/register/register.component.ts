import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  myForm!: FormGroup;
  regiones: string[] = ["LATAM", "Brazil", "Rusia"];
  sites: string[] = ["Zapote", "tan grande y jugando", "Fuyuki"];

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      region: ['', Validators.required],
      site: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);
      // Lógica para enviar el formulario aquí
    } else {
      console.log('Formulario inválido');
    }
  }
}
 