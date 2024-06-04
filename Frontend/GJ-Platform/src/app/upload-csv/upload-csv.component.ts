import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.prod';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './upload-csv.component.html',
  styleUrl : './upload-csv.component.css'
})
export class UploadCsvComponent {
  file: File | null = null;
  registrationResults: string[] = [];
  errorLog: string[] = [];  

  constructor(private http: HttpClient, private UserService: UserService) {}

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        // El tipo de archivo no es CSV
        console.error('Error: El archivo seleccionado no es un archivo CSV.');
        this.file = null;
      } else {
        // El archivo es válido
        this.file = selectedFile;
      }
    }
  }

  changeStatus() {
    this.http.get<any>(`http://${environment.apiUrl}:3000/api/site/change-status`, { withCredentials: true })
      .subscribe(
        response => {
          if (response && response.success) {
            window.location.reload();
          }
        },
        error => {
          console.error('Error changing site status:', error);
        }
      );
  }

  uploadFile(): void {
    if (this.file) {
      this.UserService.uploadUsersFromCSV(this.file).subscribe(
        (response) => {
          if (response.success) {
            this.registrationResults = response.registrationResults;
            this.errorLog = response.errorLog;
          } else {
            console.error('Error:', response.error);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }
}
