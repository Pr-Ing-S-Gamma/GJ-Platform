import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameJam, Theme } from '../../../types';
import { ThemeService } from '../../services/theme.service';
import { GamejamService } from '../../services/gamejam.service';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  columnOptions = [
    { label: 'Edition', value: 'edition' as keyof GameJam, checked: false },
    { label: 'TTheme Name (EN)', value: 'theme.titleEN' as keyof GameJam, checked: false },
    { label: 'Theme Description(EN', value: 'theme.descriptionEN' as keyof GameJam, checked: false },
    { label: 'Theme Manual(EN)', value: 'theme.manualEN' as keyof GameJam, checked: false }
  ];

  userToEdit : any;
  indexUser = 0
  selectedHeader: string | undefined;
  filterValue: string = '';
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
  selectedColumns: (keyof GameJam)[] = []; 
  toggleColumn(column: keyof GameJam, event: any) {
    if (event.target.checked) {
      this.selectedColumns.push(column);
    } else {
      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    }
  }

  exportToPDF() {
    const doc = new jsPDF();

    const selectedData = this.obtenerDatosPagina().map(row => {
      const rowData: any[] = [];
      this.selectedColumns.forEach(column => {
        if (column.startsWith('theme.')) {
          const themeProperty = column.split('.')[1];
          rowData.push((row.theme as {[key: string]: string})[themeProperty]);
        } else {
          rowData.push(row[column]);
        }
      });
      return rowData;
    });

    const headers = this.selectedColumns.map((column: string) => {
      if (column === '_id') return 'ID';
      if (column === 'edition') return 'Edition';
      if (column === 'theme._id') return 'Theme ID';
      if (column === 'theme.titleEN') return 'Theme Title';
      if (column === 'theme.descriptionEN') return 'Theme Description';
      if (column === 'theme.manualEN') return 'Theme Manual';
      return column.replace(/[A-Z]/g, ' $&').toUpperCase();
    });

    autoTable(doc, {
      head: [headers],
      body: selectedData
    });

    doc.save('gameJams.pdf');
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
    }
    
    showErrorMessage(message: string) {
      this.errorMessage = message;
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
    let filteredData = this.dataSource;
  
    if (this.selectedHeader !== undefined && this.filterValue.trim() !== '') {
      const filterText = this.filterValue.trim().toLowerCase();
      filteredData = filteredData.filter(item => {
        switch (this.selectedHeader) {
          case '_id':
            return item._id && item._id.toLowerCase().startsWith(filterText);
          case 'edition':
          case 'theme.titleEN':
          case 'theme._id':
          case 'theme.descriptionEN':
          case 'theme.manualEN':
            return (item[this.selectedHeader as keyof GameJam] as string).toLowerCase().startsWith(filterText);
          default:
            return false;
        }
      });
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredData.slice(startIndex, startIndex + this.pageSize);
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
  
    if (currentPage - inicio > rango) {
      paginasMostradas.unshift('...');
    }
    
    if (fin < totalPaginas - 1) {
      paginasMostradas.push('...');
    }
    /*
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
    */
    return paginasMostradas;
}

  ventanaAgregar: boolean = false;
}
