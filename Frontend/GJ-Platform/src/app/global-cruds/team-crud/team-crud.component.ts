import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GameJam, Region, Site, Team, User } from '../../../types';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user.service';
import { RegionService } from '../../services/region.service';
import { SiteService } from '../../services/site.service';
import { GamejamService } from '../../services/gamejam.service';
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
  dataSource: Team[] = [];
  users: User[] = [];
  regions: Region[] = [];
  sites: Site[] = [];
  gameJams: GameJam[] = [];
  teamToEdit: any;
  indexTeam = 0;
  constructor(private fb: FormBuilder, private teamService: TeamService, private userService: UserService, private regionService: RegionService, private siteService: SiteService, private gamejamService: GamejamService){
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      studioName: ['', Validators.required],
      description: ['', Validators.required],
      gameJam: ['', Validators.required],
      region: ['', Validators.required],
      site: ['', Validators.required],
      selectedUser: [''],
      linkTree: [''],
      linkTrees: this.fb.array([]),
      jammers: this.fb.array<User>([])
    });

    this.gamejamService.getGameJams('http://localhost:3000/api/game-jam/get-game-jams').subscribe(
      (gamejams: any[]) => {
        this.gameJams = gamejams.map(gamejam => ({ _id: gamejam._id, edition: gamejam.edition, region: gamejam.region, site: gamejam.site, theme: gamejam.theme}));
      },
      error => {
        console.error('Error al obtener GameJams:', error);
      }
    );
    this.regionService.getRegions('http://localhost:3000/api/region/get-regions')
    .subscribe(
      regions => {
        this.regions = regions;
      },
      error => {
        console.error('Error al obtener regiones:', error);
      }
    );
    this.teamService.getTeams('http://localhost:3000/api/team/get-teams')
    .subscribe(
      teams => {
        this.dataSource = teams;
      },
      error => {
        console.error('Error al obtener equipos:', error);
      }
    );
  }
  onRegionSelection() {
    const selectedValue = this.myForm.get('region')?.value;
    (this.myForm.get('jammers') as FormArray).clear();
    if (selectedValue && selectedValue._id) {
      this.siteService.getSitesPerRegion(`http://localhost:3000/api/site/get-sites-per-region/${selectedValue._id}`)
        .subscribe(
          sites => {
            this.sites = sites;

            if (this.sites.length > 0) {
              this.myForm.get('site')?.setValue(this.sites[0]);
              if (sites[0] && sites[0]._id) {
                console.log(sites[0]._id);
                this.userService.getUsers(`http://localhost:3000/api/user/get-jammers-per-site/${sites[0]._id}`)
                .subscribe(
                  users => {
                    this.users = users;
                  },
                  error => {
                    console.error('Error al obtener jammers:', error);
                  }
                );
              } else {
                console.error('El site seleccionado no tiene un ID válido.');
              }
            }
          },
          error => {
            console.error('Error al obtener sites:', error);
          }
        );
    } else {
      console.error('La región seleccionada no tiene un ID válido.');
    }
  }

  onSiteSelection() {
    const selectedValue = this.myForm.get('site')?.value;
    (this.myForm.get('jammers') as FormArray).clear();
    if (selectedValue && selectedValue._id) {
      this.userService.getUsers(`http://localhost:3000/api/user/get-jammers-per-site/${selectedValue._id}`)
      .subscribe(
        users => {
          console.log(users);
          this.users = users;
        },
        error => {
          console.error('Error al obtener jammers:', error);
        }
      );
    } else {
      console.error('El site seleccionado no tiene un ID válido.');
    }
  }
  addJammer() {
    const selectedUser = this.myForm.get('selectedUser');
    if (selectedUser && selectedUser.value) {
        const userValue: User = selectedUser.value;
        console.log(userValue);
        const jammersArray = this.myForm.get('jammers') as FormArray;
        if (!jammersArray.value.some((jammer: User) => jammer._id === userValue._id)) {
            jammersArray.push(this.fb.control(userValue));
        } else {
            console.log("El usuario ya está en la lista de jammers.");
        }
    } else {
        console.log("Form or selectedUser is null.");
    }
}

removeJammer(jammer: User) {
  const jammersArray = this.myForm.get('jammers') as FormArray;
  const index = jammersArray.controls.findIndex(control => control.value._id === jammer._id);
  if (index !== -1) {
      jammersArray.removeAt(index);
  }
}


  seleccionarElemento(elemento: any) {
    this.teamToEdit = elemento;
    this.indexTeam = this.dataSource.indexOf(elemento);
    const selectedGameJam = this.gameJams.find(gameJam => gameJam._id === elemento.gameJam._id);
    const selectedRegion = this.regions.find(region => region._id === elemento.region._id);
    this.siteService.getSitesPerRegion(`http://localhost:3000/api/site/get-sites-per-region/${elemento.region._id}`)
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
    
    const selectedSite = this.sites.find(site => site._id === elemento.site._id);
    this.userService.getUsers(`http://localhost:3000/api/user/get-jammers-per-site/${elemento.site._id}`)
    .subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error al obtener jammers:', error);
      }
    );
    this.myForm.patchValue({
      studioName: elemento.studioName,
      description: elemento.description,
      gameJam: selectedGameJam,
      region: selectedRegion,
      site: selectedSite
    });
    (this.myForm.get('linkTrees') as FormArray).clear();
    (this.myForm.get('jammers') as FormArray).clear();
    elemento.linkTree.forEach((link: string) => {
      (this.myForm.get('linkTrees') as FormArray).push(this.fb.control(link));
    });    
    elemento.jammers.forEach((jammer: User) => {
      (this.myForm.get('jammers') as FormArray).push(this.fb.group({
        _id: jammer._id,
        name: jammer.name,
        email: jammer.email
      }));
    });
  }
  editar() {
    if (this.myForm.valid) {
    const teamId = this.teamToEdit['_id'];
    const { studioName, description, gameJam, linkTrees, jammers, site, region } = this.myForm.value;
    this.teamService.updateTeam(`http://localhost:3000/api/team/update-team/${teamId}`, {
      studioName: studioName,
      description: description,
      gameJam: {
        _id: gameJam._id,
        edition: gameJam.edition
      },
      linkTree: linkTrees,
      jammers: jammers.map((jammer: { _id: string; name: string; email: string; }) => ({
          _id: jammer._id,
          name: jammer.name,
          email: jammer.email
        })),
        site: {
          _id: site._id,
          name: site.name
        },
        region: {
          _id: region._id,
          name: region.name
        }
      }).subscribe({
        next: (data) => {
          if (data.success) {
            this.dataSource[this.dataSource.findIndex(team => team._id === data.team._id)] = data.team;
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
       }
       },
       error: (error) => {
         this.showErrorMessage(error.error.error);
       }
       });
      } else {
      this.showErrorMessage('Please fill in all fields of the form');
      }
}
  

  eliminar(elemento: any) {
    const id = elemento._id;

    const url = `http://localhost:3000/api/team/delete-team/${id}`;

    this.teamService.deleteTeam(url).subscribe({
        next: (data) => {
            console.log('Equipo eliminado correctamente:', data);
            this.dataSource = this.dataSource.filter(item => item !== elemento);
            this.showSuccessMessage(data.msg);
        },
        error: (error) => {
            console.error('Error al eliminar el equipo:', error);
            this.showErrorMessage(error.error.msg);
        }
    });
  }
  
  agregar() {
          if (this.myForm.valid) {
          const { studioName, description, gameJam, linkTrees, jammers, site, region } = this.myForm.value;
          this.teamService.createTeam(`http://localhost:3000/api/team/create-team`, {
            studioName: studioName,
            description: description,
            gameJam: {
              _id: gameJam._id,
              edition: gameJam.edition
            },
            linkTree: linkTrees,
            jammers: jammers.map((jammer: { _id: string; name: string; email: string; }) => ({
              _id: jammer._id,
              name: jammer.name,
              email: jammer.email
            })),
            site: {
              _id: site._id,
              name: site.name
            },
            region: {
              _id: region._id,
              name: region.name
            }
          }).subscribe({
            next: (data) => {
              if (data.success) {
                this.dataSource.push(data.team); 
                this.showSuccessMessage(data.msg);
              } else {
                this.showErrorMessage(data.error);
             }
             },
             error: (error) => {
               this.showErrorMessage(error.error.error);
             }
             });
            } else {
            this.showErrorMessage('Please fill in all fields of the form');
            }
  }
    
  
  addLinkTree() {
    const linkTreeControl = this.myForm.get('linkTree');
    if (linkTreeControl) {
        const newLink = linkTreeControl.value;
        if (newLink.trim() !== '') {
            const linkTreesArray = this.myForm.get('linkTrees') as FormArray;
            if (!linkTreesArray.value.includes(newLink)) {
                linkTreesArray.push(this.fb.control(newLink));
                linkTreeControl.setValue('');
            }
        }
    } else {
        console.log("Form or linkTree control is null.");
    }
}

removeLinkTree(link: string) {
    const linkTreesArray = this.myForm.get('linkTrees') as FormArray;
    const index = linkTreesArray.value.indexOf(link);
    if (index !== -1) {
        linkTreesArray.removeAt(index);
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
