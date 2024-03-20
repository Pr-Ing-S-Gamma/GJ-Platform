import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-stage-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './stage-crud.component.html',
  styleUrl: './stage-crud.component.css'
})
export class StageCrudComponent implements OnInit{

  myForm!: FormGroup;
  dataSource = [
    { id: 1, name: 'I fase' , startDate: '2024-03-10', endDate: '2024-04-31' , gamejamId : 1},
    { id: 2, name: 'I fase' , startDate: '2024-04-05', endDate: '2024-05-05' , gamejamId : 2},
    { id: 3, name: 'II fase' , startDate: '2024-05-01', endDate: '2024-06-15' , gamejamId : 1}
  ];
  gamejams = ['1-zapote', '2-tangamandapop', '3-libertycity', '4-teyvat', '5-colonipenal']

  stageToEdit: any;
  indexStage = 0;
  constructor(private fb: FormBuilder){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      gamejamId : ['', Validators.required]
    });
  }
  seleccionarElemento(elemento: any) {
    this.stageToEdit = elemento;
    this.indexStage = this.dataSource.indexOf(elemento);
    
    // Autollenar los campos del formulario con los datos existentes del elemento seleccionado
    this.myForm.patchValue({
      name: elemento.name,
      startDate: elemento.startDate,
      endDate: elemento.endDate,
      gamejamId: elemento.gamejamId
    });
  }
  eliminar(elemento: any) {
    this.dataSource = this.dataSource.filter(i => i !== elemento);
  }
  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);
      this.dataSource[this.indexStage] = {
        id: this.stageToEdit['id'],
        name: this.myForm.value['name'],
        startDate: this.myForm.value['startDate'],
        endDate: this.myForm.value['endDate'],
        gamejamId :this.myForm.value['gamejamId']
      }
      this.showSuccessMessage("Success!")
    } else {
      console.log('Formulario inválido');
    }
  }
  
  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value)
      this.dataSource.push({
        id: this.stageToEdit['id'],
        name: this.myForm.value['name'],
        startDate: this.myForm.value['startDate'],
        endDate: this.myForm.value['endDate'],
        gamejamId :this.myForm.value['gamejamId']
      })
      this.showSuccessMessage("Success!")
    } else {
      console.log('Formulario inválido');
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

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
