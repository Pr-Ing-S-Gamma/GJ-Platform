import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-region-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './region-crud.component.html',
  styleUrl: './region-crud.component.css'
})
export class RegionCRUDComponent implements OnInit{
  myForm!: FormGroup;
  dataSource = [
    { id: 1, region: 'LATAM' },
    { id: 2, region: 'Brazil' },
    { id: 3, region: 'Asia' }
  ];
  
  regionToEdit: any;
  indexRegion = 0;
  constructor(private fb: FormBuilder){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      region: ['', Validators.required]
    });
  }

  seleccionarElemento(elemento:any){
    let regionEditInput = document.getElementById('regionEditInput') as HTMLInputElement;
    this.regionToEdit = elemento
    this.indexRegion =this.dataSource.indexOf(elemento)
    regionEditInput.value = this.regionToEdit["region"];
  }

  // Aquí puedes agregar la lógica para editar y eliminar elementos
  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);
      // Lógica para enviar el formulario aquí
      this.dataSource[this.indexRegion] = {
        id: this.regionToEdit['id'],
        region: this.myForm.value['region']
      }
      this.openModal()
    } else {
      console.log('Formulario inválido');
    }
  }

  eliminar(elemento: any) {
    // Lógica para enviar el formulario aquí
    this.dataSource = this.dataSource.filter(i => i !== elemento)
  }

  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      console.log('Valores del formulario:', this.myForm.value);

      // Lógica para enviar el formulario aquí

      this.dataSource.push({id: 0, region: this.myForm.value["region"]})
      this.openModal()
    } else {
      console.log('Formulario inválido');
    }
  }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  // @ts-ignore
  @ViewChild('succesModal') succesModal:ElementRef;

  openModal(){
    $(this.succesModal.nativeElement).modal('show'); 
  }
  closeModal(){
    $(this.succesModal.nativeElement).modal('hide'); 
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
    return this.dataSource.slice(startIndex, startIndex + this.pageSize);
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
