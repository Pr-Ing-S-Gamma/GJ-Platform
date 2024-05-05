import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameJam, Theme } from '../../../types';
import { ThemeService } from '../../services/theme.service';
import { GamejamService } from '../../services/gamejam.service';
declare var $: any;


@Component({
  selector: 'app-gamejam-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './gamejam-crud.component.html',
  styleUrl: './gamejam-crud.component.css'
})
export class GamejamCrudComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: GameJam[] = [];
  themes: Theme[] = [];
  
  userToEdit : any;
  indexUser = 0
  constructor(private fb: FormBuilder, private gamejamService: GamejamService, private themeService: ThemeService){}
  ngOnInit(): void {
    this.myForm = this.fb.group({
      edition: ['', Validators.required],
      theme: ['', Validators.required],
    });
    const url = 'http://localhost:3000/api/game-jam/get-game-jams';
    this.gamejamService.getGameJams(url).subscribe(
      (gamejams: any[]) => {
        this.dataSource = gamejams.map(gamejam => ({ _id: gamejam._id, edition: gamejam.edition, theme: gamejam.theme}));
      },
      error => {
        console.error('Error al obtener las GameJams:', error);
      }
    );
    this.themeService.getThemes('http://localhost:3000/api/theme/get-themes')
    .subscribe(
      themes => {
        this.themes = themes;
      },
      error => {
        console.error('Error al obtener temas:', error);
      }
    );
  }

  seleccionarElemento(elemento: any) {
    this.userToEdit = elemento;
    this.indexUser = this.dataSource.indexOf(elemento);
    const selectedTheme = this.themes.find(theme => theme._id === elemento.theme._id);
    this.myForm.patchValue({
      edition: elemento.edition,
      theme: selectedTheme
    });
  }
  
  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const gamejamId = this.userToEdit['_id'];
      const { edition, theme} = this.myForm.value;
  
      this.gamejamService.updateGameJam(`http://localhost:3000/api/game-jam/update-game-jam/${gamejamId}`, {
        edition: edition,
        theme: {
          _id: theme._id,
          titleEN: theme.titleEN,
          descriptionEN: theme.descriptionEN,
          manualEN: theme.manualEN
        }
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexUser]={ _id: gamejamId, edition: edition, theme: theme};
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
  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://localhost:3000/api/game-jam/delete-game-jam/${id}`;

    this.gamejamService.deleteGameJam(url).subscribe({
        next: (data) => {
            console.log('GameJam eliminada correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar la GameJam:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }
    agregar() {
      if (this.myForm.valid) {
        console.log('Formulario válido');
        
        const { edition, theme} = this.myForm.value;;
        this.gamejamService.createGameJam(`http://localhost:3000/api/game-jam/create-game-jam`, {
          edition: edition,
          theme: {
            _id: theme._id,
            titleEN: theme.titleEN,
            descriptionEN: theme.descriptionEN,
            manualEN: theme.manualEN
          }
        }).subscribe({
          next: (data) => {
            if (data.success) {
              const gameJamId = data.gameJamId;
              this.dataSource.push({ _id: gameJamId, edition: edition, theme: theme});
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

    successMessage: string = '';
    errorMessage: string = '';
    
    showSuccessMessage(message: string) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = ''; 
      }, 5000); 
    }
    
    showErrorMessage(message: string) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = ''; 
      }, 5000); 
    }
    
  get totalPaginas(): number {
    return Math.ceil(this.dataSource.length / this.pageSize);
  }

  pageSize = 5; 
  currentPage = 1; 

  cambiarPagina(page: number) {
    this.currentPage = page;
  }

  obtenerDatosPagina() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.dataSource.length);
    return this.dataSource.slice(startIndex, endIndex);
  }

  get paginasMostradas(): (number | '...')[] {
    const totalPaginas = this.totalPaginas;
    const currentPage = this.currentPage;
    const paginasMostradas: (number | '...')[] = [];

    const rango = 2;

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
