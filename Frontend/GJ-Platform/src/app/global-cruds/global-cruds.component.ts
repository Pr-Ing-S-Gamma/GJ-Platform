import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RegionCRUDComponent } from './region-crud/region-crud.component';

@Component({
  selector: 'app-global-cruds',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CommonModule,
    RegionCRUDComponent
  ],
  templateUrl: './global-cruds.component.html',
  styleUrl: './global-cruds.component.css'
})
export class GlobalCRUDsComponent{
  showRegions: boolean = false;
  showSites: boolean = false;

  toggleRegions(){
    this.showRegions = !this.showRegions;
  }

  toggleSites(){
    this.showSites = !this.showSites
  }
}
