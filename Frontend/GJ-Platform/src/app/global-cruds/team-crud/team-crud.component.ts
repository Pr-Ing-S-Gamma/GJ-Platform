import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-team-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './team-crud.component.html',
  styleUrl: './team-crud.component.css'
})
export class TeamCrudComponent implements OnInit {
  myForm!: FormGroup;
  dataSource = [
    { id: 1, studioName: 'Team kokokas' , description: 'kokas', gameJamId : 10, siteName: 'Zapotelandia', Links: [ 'https://tecdigital.tec.ac.cr/dotlrn/'] , jammers : ['Jefry', 'Sharon', 'David']},
  ];
  jammers = ['Sharon', 'David', 'pepito', 'laura', 'Ari', 'Jefry']
  
  sites = ['Asia', 'GrandLine', 'LATAM', 'Brazil', 'Partido de la amistad']
  
 gamejams = ['1-zapote', '2-tangamandapop', '3-libertycity', '4-teyvat', '5-colonipenal']
 newJammer: string = ''; // Variable para almacenar el nuevo jammer
  teamToEdit: any;
  indexTeam = 0;
  constructor(private fb: FormBuilder){
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      studioName: ['', Validators.required],
      description: ['', Validators.required],
      gameJamId: ['', Validators.required],
      siteName: ['', Validators.required],
      Links: this.fb.array([]), // Asegúrate de que se inicializa como un FormArray vacío
      jammers: this.fb.array([]) // Asegúrate de que se inicializa como un FormArray vacío
    });
  }
  


  seleccionarElemento(elemento: any) {
    this.teamToEdit = elemento;
    this.indexTeam = this.dataSource.indexOf(elemento);
    
    // Autollenar los campos del formulario con los datos existentes del elemento seleccionado
    this.myForm.patchValue({
      studioName: elemento.studioName,
      description: elemento.description,
      gameJamId: elemento.gameJamId,
      siteName: elemento.siteName,
      Links: elemento.Links, // Asignar el valor de Links al formulario
      jammers: elemento.jammers // Asignar el valor de jammers al formulario
    });
  }

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);
      this.dataSource[this.indexTeam] = {
        id: this.teamToEdit['id'],
        studioName: this.myForm.value['studioName'],
        description: this.myForm.value['description'],
        gameJamId: this.myForm.value['gameJamId'],
        siteName: this.myForm.value['siteName'],
        Links: this.myForm.value['Links'], // Asignar el valor de Links al objeto editado
        jammers: this.myForm.value['jammers'] // Asignar el valor de jammers al objeto editado
      }
      this.showSuccessMessage("Success!")
    } else {
      console.log('Formulario inválido');
    }
  }

  eliminar(elemento: any) {
    this.dataSource = this.dataSource.filter(i => i !== elemento);
  }
  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value)
      this.dataSource.push({
        id: this.dataSource.length + 1,
        studioName: this.myForm.value['studioName'],
        description: this.myForm.value['description'],
        gameJamId: this.myForm.value['gameJamId'],
        siteName: this.myForm.value['siteName'],
        Links: this.myForm.value['Links'], // Asignar el valor de Links al objeto agregado
        jammers: this.myForm.value['jammers'] // Asignar el valor de jammers al objeto agregado
      })
      this.showSuccessMessage("Success!")
    } else {
      console.log('Formulario inválido');
    }
  }


  successMessage: string = '';

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
    }, 5000); // Limpia el mensaje después de 5 segundos
  }
  
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual
    // Función para cambiar de página
    cambiarPagina(page: number) {
      this.currentPage = page;
    }
  
    // Función para obtener los datos de la página actual
    obtenerDatosPagina() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.dataSource.length);
      return this.dataSource.slice(startIndex, endIndex);
    }
  
    get paginasMostradas(): (number | '...')[] {
      const totalPaginas = this.totalPaginas;
      const currentPage = this.currentPage;
      const paginasMostradas: (number | '...')[] = [];
  
      const rango = 2; // Cambia esto para ajustar el número de páginas mostradas
  
      let inicio = Math.max(1, currentPage - rango);
      let fin = Math.min(totalPaginas, currentPage + rango);
  
      for (let i = inicio; i <= fin; i++) {
        paginasMostradas.push(i);
      }
  
      if (inicio == 1){
        switch(fin - inicio){
          case 2:
            paginasMostradas.push(4);
            paginasMostradas.push(5);
            break;
          case 3:
            paginasMostradas.push(5);
            break;
          default: break;
        }
      }
      if (fin == totalPaginas){
        switch(fin - inicio){
          case 2:
            paginasMostradas.unshift(totalPaginas-4, totalPaginas-3);
            break;
          case 3:
            paginasMostradas.unshift(totalPaginas-4);
            break;
          default: break;
        }
      }
      return paginasMostradas;
  }
  
    ventanaAgregar: boolean = false;
}
