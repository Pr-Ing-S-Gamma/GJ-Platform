import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Region, Site, User } from '../../../types';
import { SiteService } from '../../services/site.service';
import { RegionService } from '../../services/region.service';
declare var $: any;


@Component({
  selector: 'app-user-crud',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-crud.component.html',
  styleUrl: './user-crud.component.css'
})
export class UserCrudComponent implements OnInit{
  myForm!: FormGroup;
  dataSource: User[] = [];
  regions: Region[] = [];
  sites: Site[] = [];
  rols = ['GlobalOrganizer', 'LocalOrganizer', 'Judge', 'Jammer']
  
  userToEdit : any;
  indexUser = 0
  constructor(private fb: FormBuilder, private userService: UserService, private siteService: SiteService, private regionService: RegionService){}
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      rol: ['', Validators.required],
      region: ['', Validators.required],
      site: ['', Validators.required]
    });
    const url = 'http://149.130.176.112:3000/api/user/get-users';
    this.userService.getUsers(url).subscribe(
      (users: any[]) => {
        this.dataSource = users.map(user => ({ _id: user._id, name: user.name, email: user.email, region: user.region, site: user.site, rol: user.rol, coins: user.coins }));
      },
      error => {
        console.error('Error al obtener usuarios:', error);
      }
    );
    this.regionService.getRegions('http://149.130.176.112:3000/api/region/get-regions')
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
  }

  onRegionSelection() {
    const selectedValue = this.myForm.get('region')?.value;
    if (selectedValue && selectedValue._id) {
      this.siteService.getSitesPerRegion(`http://149.130.176.112:3000/api/site/get-sites-per-region/${selectedValue._id}`)
        .subscribe(
          sites => {
            this.sites = sites;

            if (this.sites.length > 0) {
              this.myForm.get('site')?.setValue(this.sites[0]);
            }
          },
          error => {
            console.error('Error al obtener sitios:', error);
          }
        );
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }
  seleccionarElemento(elemento: any) {
    this.userToEdit = elemento;
    this.indexUser = this.dataSource.indexOf(elemento);
    const selectedRegion = this.regions.find(region => region._id === elemento.region._id);
    const selectedSite = this.sites.find(site => site._id === elemento.site._id);
    this.siteService.getSitesPerRegion(`http://149.130.176.112:3000/api/site/get-sites-per-region/${elemento.region._id}`)
    .subscribe(
      sites => {
        this.sites = sites;

        if (this.sites.length > 0) {
          this.myForm.get('site')?.setValue(this.sites[0]);
        }
      },
      error => {
        console.error('Error al obtener sitios:', error);
      }
    );
    this.myForm.patchValue({
      name: elemento.name,
      region: selectedRegion, 
      site: selectedSite, 
      rol: elemento.rol,
      email: elemento.email
    });
  }

  editar() {
    if (this.myForm.valid) {
      console.log('Formulario válido');
      const userId = this.userToEdit['_id'];
      const { email, name, region, site, rol } = this.myForm.value;
  
      this.userService.updateUser(`http://149.130.176.112:3000/api/user/update-user/${userId}`, {
        name: name,
        email: email,
        region: {
          _id: region._id,
          name: region.name
        },
        site: {
          _id: site._id,
          name: site.name
        },
        rol: rol,
        coins: 0,
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.indexUser]={ _id: userId, name: name, email: email, region: region, site: site, rol: rol, coins: 0};
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
      console.log('Formulario inválido');
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

    eliminar(elemento: any) {
      const id = elemento._id;
  
      const url = `http://149.130.176.112:3000/api/user/delete-user/${id}`;
  
      this.userService.deleteUser(url).subscribe({
          next: (data) => {
              console.log('Usuario eliminado correctamente:', data);
              this.dataSource = this.dataSource.filter(item => item !== elemento);
              this.showSuccessMessage(data.msg);
          },
          error: (error) => {
              console.error('Error al eliminar el usuario:', error);
              this.showErrorMessage(error.error.msg);
          }
      });
    }

    agregar() {
      if (this.myForm.valid) {
        console.log('Formulario válido');
        
        const { email, name, region, site, rol} = this.myForm.value;
  
        this.userService.registerUser(`http://149.130.176.112:3000/api/user/register-user`, {
          name: name,
          email: email,
          region: {
            _id: region._id,
            name: region.name
          },
          site: {
            _id: site._id,
            name: site.name
          },
          rol: rol,
          coins: 0,
        }).subscribe({
          next: (data) => {
            if (data.success) {
              const userId = data.userId;
              this.dataSource.push({ _id: userId, name: name, email: email, region: region, site: site, rol: rol, coins: 0});
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
