import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-theme-crud',
  standalone: true,
  imports: [],
  templateUrl: './theme-crud.component.html',
  styleUrl: './theme-crud.component.css'
})
export class ThemeCrudComponent implements OnInit{

  myForm!: FormGroup;
  dataSource = [
    { id: 1, region: 'Horror idk' },
    { id: 2, region: 'Peleas idk' },
    { id: 3, region: 'Blanco i negro idk' }
  ];
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
