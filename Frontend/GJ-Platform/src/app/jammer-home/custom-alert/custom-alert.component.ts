import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent {
  @Input() message: string = "Agregado con éxito";

  constructor(public dialogRef: MatDialogRef<CustomAlertComponent>){}
}
