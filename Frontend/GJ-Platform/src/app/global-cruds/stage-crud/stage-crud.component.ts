import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StageService } from '../../services/stage.service';
import { GameJam, Stage } from '../../../types';
import { GamejamService } from '../../services/gamejam.service';
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
  dataSource: Stage[] = [];
  gameJams: GameJam[] = [];

  stageToEdit: any;
  indexStage = 0;
  constructor(private fb: FormBuilder, private stageService: StageService, private gamejamService: GamejamService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      gameJam : ['', Validators.required]
    });

    const url = 'http://localhost:3000/api/game-jam/get-game-jams';
    this.gamejamService.getGameJams(url).subscribe(
      (gamejams: any[]) => {
        this.gameJams = gamejams.map(gamejam => ({ _id: gamejam._id, edition: gamejam.edition, region: gamejam.region, site: gamejam.site, theme: gamejam.theme}));
      },
      error => {
        console.error('Error al obtener GameJams:', error);
      }
    );
    this.stageService.getStages('http://localhost:3000/api/stage/get-stages')
    .subscribe(
      stages => {
        this.dataSource = stages;
      },
      error => {
        console.error('Error al obtener fases:', error);
      }
    );
  }

  seleccionarElemento(elemento: any) {
    this.stageToEdit = elemento;
    this.indexStage = this.dataSource.indexOf(elemento);
    const selectedGameJam = this.gameJams.find(gameJam => gameJam._id === elemento.gameJam._id);
    
    const startDate = new Date(elemento.startDate);
    const endDate = new Date(elemento.endDate);
  
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    this.myForm.patchValue({
      name: elemento.name,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      gameJam: selectedGameJam
    });
  }

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://localhost:3000/api/stage/delete-stage/${id}`;

    this.stageService.deleteStage(url).subscribe({
        next: (data) => {
            console.log('Fase eliminada correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar la fase:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const stageId = this.stageToEdit['_id'];
      const { name, startDate, endDate, gameJam} = this.myForm.value;
      this.stageService.updateStage(`http://localhost:3000/api/stage/update-stage/${stageId}`, {
        name: name,
        startDate: startDate,
        endDate: endDate,
        gameJam: {
          _id: gameJam._id,
          edition: gameJam.edition
        },
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexStage]={ _id: stageId, name: name, startDate: startDate, endDate: endDate,
              gameJam: {
                _id: gameJam._id,
                edition: gameJam.edition
              }
            }
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }
  
  agregar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      
      const { name, startDate, endDate, gameJam} = this.myForm.value;
      this.stageService.createStage(`http://localhost:3000/api/stage/create-stage`, {
        name: name,
        startDate: startDate,
        endDate: endDate,
        gameJam: {
          _id: gameJam._id,
          edition: gameJam.edition
        },
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const stageId = data.stageId;
            this.dataSource.push({ _id: stageId, name: name, startDate: startDate, endDate: endDate,
            gameJam: {
              _id: gameJam._id,
              edition: gameJam.edition
            }});
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

successMessage: string = '';
errorMessage: string = '';

showSuccessMessage(message: string) {
  this.successMessage = message;
  setTimeout(() => {
    this.successMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
  }, 5000); // Limpia el mensaje después de 5 segundos
}

showErrorMessage(message: string) {
  this.errorMessage = message;
  setTimeout(() => {
    this.errorMessage = ''; // Limpia el mensaje después de cierto tiempo (opcional)
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
