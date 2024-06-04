import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css'] 
})
export class UploadCsvComponent {
  file: File | null = null;
  registrationResults: string[] = [];
  errorLog: string[] = [];  

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    console.log('Selected file:', this.file);
  }

  uploadFile() {
    if (!this.file) {
      this.errorLog[0] = 'Please select a file.';
      setTimeout(() => {
        this.errorLog = [];
      }, 5000); 
      return;
    }
  
    const formData = new FormData();
    formData.append('csvFile', this.file);
  
    this.http.post<any>(`http://${environment.apiUrl}:3000/api/upload-csv`, formData, { withCredentials: true })
      .subscribe(
        response => {
          this.registrationResults = response.registrationResults;
          this.errorLog = response.errorLog;
          setTimeout(() => {
            this.registrationResults = [];
            this.errorLog = [];
          }, 5000);
        },
        error => {
          this.errorLog[0] = 'Error uploading CSV file.';
          setTimeout(() => {
            this.errorLog = [];
          }, 5000);
        }
      );
  }
}
