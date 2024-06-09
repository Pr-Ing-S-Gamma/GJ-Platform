import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameJam, Theme } from '../../../types';
import { ThemeService } from '../../services/theme.service';
import { GamejamService } from '../../services/gamejam.service';
declare var $: any;
import { jsPDF }  from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment.prod';

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
export class GamejamCrudComponent implements OnInit {
  myForm!: FormGroup;
  dataSource: GameJam[] = [];
  themes: any[] = [];
  columnOptions = [
    { label: 'Edition', value: 'edition' as keyof GameJam, checked: false },
    { label: 'Themes', value: 'theme.titleEN' as keyof GameJam, checked: false },
  ];

  userToEdit: any;
  indexUser = 0;
  selectedHeader: string | undefined;
  filterValue: string = '';
  
  constructor(private fb: FormBuilder, private gamejamService: GamejamService, private themeService: ThemeService) {}
  get themeFormArray(): FormArray {
    return this.myForm.get('theme') as FormArray;
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      edition: ['', Validators.required],
      theme: this.fb.array([], Validators.required),
      selectedTheme:[]
    });
    const url = `http://${environment.apiUrl}:3000/api/game-jam/get-game-jams`;
    this.gamejamService.getGameJams(url).subscribe(
      (gamejams: any[]) => {
        this.dataSource = gamejams.map(gamejam => ({ _id: gamejam._id, edition: gamejam.edition, themes: gamejam.themes}));
      },
      error => {
        console.error('Error al obtener las GameJams:', error);
      }
    );
    this.themeService.getThemes(`http://${environment.apiUrl}:3000/api/theme/get-themes`)
    .subscribe(
      themes => {
        this.themes = themes.map(theme =>({_id : theme._id, titleEN: theme.titleEN}))
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
  
  addTheme() {
    const selectedTheme = this.myForm.get('selectedTheme');
      const themeValue: Theme = selectedTheme?.value;
      const themeArray = this.myForm.get("theme") as FormArray;
      if(!themeArray.value.some((theme: Theme)=>theme._id ===themeValue._id)){
        themeArray.push(this.fb.control(themeValue));
      }else{
        console.log("Theme already on GJ");
      }
  }
  
  removeTheme(index: number) {
    (this.myForm.get('theme') as FormArray).removeAt(index);
  }
  
  exportToPDF() {
    const doc = new jsPDF();
  
    // Obtener datos filtrados
    const selectedData = this.obtenerDatosPagina().map(row => {
      const rowData: any[] = [];
      this.selectedColumns.forEach(column => {
        if (column.startsWith('theme.')) {
          const themeProperty = column.split('.')[1]; // Remove the type assertion for now
          const themeValue = row.themes.map((theme: any) => theme[themeProperty]).join(', '); // Adjust the type to 'any' temporarily
          rowData.push(themeValue);
        } else {
          rowData.push(row[column as keyof GameJam] !== undefined ? row[column as keyof GameJam] : '');
        }
      });
      return rowData;
    });
  
    // Crear encabezados
    const headers = this.selectedColumns.map((column: string) => {
      if (column === '_id') return 'ID';
      if (column === 'edition') return 'Edition';
      if (column === 'theme._id') return 'Theme ID';
      if (column === 'theme.titleEN') return 'Theme Title';
      return column.replace(/\b\w/g, char => char.toUpperCase()).replace(/[A-Z]/g, ' $&').trim();
    });
  
    // Generar tabla en el PDF
    autoTable(doc, {
      head: [headers],
      body: selectedData
    });
  
    // Guardar el PDF
    doc.save('gameJams.pdf');
  }
  

  seleccionarElemento(elemento: any) {
    this.userToEdit = elemento;
    this.indexUser = this.dataSource.indexOf(elemento);
    this.myForm.patchValue({
      edition: elemento.edition,
      theme: elemento.theme.map((t: any) => this.themes.find(theme => theme._id === t._id))
    });
  }

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const gamejamId = this.userToEdit['_id'];
      const { edition, themes } = this.myForm.value;
  
      this.gamejamService.updateGameJam(`http://${environment.apiUrl}:3000/api/game-jam/update-game-jam/${gamejamId}`, {
        edition: edition,
        themes: themes.map((t: Theme) => ({ _id: t._id, titleEN: t.titleEN }))
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexUser] = { _id: gamejamId, edition: edition, themes: themes };
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
    const url = `http://${environment.apiUrl}:3000/api/game-jam/delete-game-jam/${id}`;

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
  
      const { edition, themes } = this.myForm.value;
      this.gamejamService.createGameJam(`http://${environment.apiUrl}:3000/api/game-jam/create-game-jam`, {
        edition: edition,
        themes: themes.map((t: Theme) => ({ _id: t._id, titleEN: t.titleEN}))
      }).subscribe({
        next: (data) => {
          if (data.success) {
            const gameJamId = data.gameJamId;
            this.dataSource.push({ _id: gameJamId, edition: edition, themes: themes });
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
            return item.edition.toLowerCase().startsWith(filterText);
          case 'theme.titleEN':
            return item.themes.some(t => t.titleEN.toLowerCase().startsWith(filterText));
          case 'theme._id':
            return item.themes.some(t => t._id.toLowerCase().startsWith(filterText));
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

    return paginasMostradas;
  }

  ventanaAgregar: boolean = false;
}
