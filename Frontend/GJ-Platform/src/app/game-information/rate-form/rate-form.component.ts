import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Category } from '../../../types';
import { SubmissionService } from '../../services/submission.service';

@Component({
  selector: 'app-rate-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './rate-form.component.html',
  styleUrl: './rate-form.component.css'
})
export class RateFormComponent {
  myForm!: FormGroup;
  @Input() game!: string;
  gameParameter!: String;
  rating: number[] = []
  pitchScore: number | undefined;
  gameDesignScore: number | undefined;
  artScore: number | undefined;
  buildScore: number | undefined;
  audioScore: number | undefined;
  evaluando: boolean | undefined;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private SubmissionService: SubmissionService) {
    for (let i = 1; i <= 10; i++) {
      this.rating.push(i);
    }
    this.evaluando = true;
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameParameter = params['game'];
    });
    this.SubmissionService.getRating("http://localhost:3000/api/submission/get-rating/" + this.gameParameter).subscribe({
      next: (data) => {
        console.log(data);
        this.myForm = this.fb.group({
          pitchScore: data.pitchScore !== undefined ? data.pitchScore: '',
          pitchFeedback: [data.pitchFeedback !== undefined ? data.pitchFeedback : ''],
          gameDesignScore: [data.gameDesignScore !== undefined ? data.gameDesignScore : ''],
          gameDesignFeedback: [data.gameDesignFeedback !== undefined ? data.gameDesignFeedback : ''],
          artScore: [data.artScore !== undefined ? data.artScore : ''],
          artFeedback: [data.artFeedback !== undefined ? data.artFeedback : ''],
          buildScore: [data.buildScore !== undefined ? data.buildScore : ''],
          buildFeedback: [data.buildFeedback !== undefined ? data.buildFeedback : ''],
          audioScore: [data.audioScore !== undefined ? data.audioScore : ''],
          audioFeedback: [data.audioFeedback !== undefined ? data.audioFeedback : ''],
          generalFeedback: [data.generalFeedback !== undefined ? data.generalFeedback : '', Validators.required]
        });
        data.pitchScore !== undefined ? this.pitchRating(data.pitchScore.valueOf()) : this.pitchScore = data.pitchScore;
        data.gameDesignScore !== undefined ? this.gameDesignRating(data.gameDesignScore.valueOf()) : this.gameDesignScore = data.gameDesignScore;
        data.artScore !== undefined ? this.artRating(data.artScore.valueOf()) : this.artScore = data.artScore;
        data.buildScore !== undefined ? this.buildRating(data.buildScore.valueOf()) : this.buildScore = data.buildScore;
        data.audioScore !== undefined ? this.audioRating(data.audioScore.valueOf()) : this.audioScore = data.audioScore;
      },
      error: (error) => {
        console.log(error);
        this.showErrorMessage(error.error.error);
      },
    });
  }

  submitEvaluation(): void{
    if (this.myForm.valid) {
      var rating = {
        submissionId: this.gameParameter,
        generalFeedback: this.myForm.value["generalFeedback"],
        pitchScore: this.myForm.value["pitchScore"],
        pitchFeedback: this.myForm.value["pitchFeedback"],
        gameDesignScore: this.myForm.value["gameDesignScore"],
        gameDesignFeedback: this.myForm.value["gameDesignFeedback"],
        artScore: this.myForm.value["artScore"],
        artFeedback: this.myForm.value["artFeedback"],
        buildScore: this.myForm.value["buildScore"],
        buildFeedback: this.myForm.value["buildFeedback"],
        audioScore: this.myForm.value["audioScore"],
        audioFeedback: this.myForm.value["audioFeedback"],
      };
      this.SubmissionService.giveRating("http://localhost:3000/api/submission/give-rating", 
        rating,
      ).subscribe({
        next: (data) => {
          console.log(data);
          if (data.success) {
            this.showSuccessMessage(data.msg);
          } else {
            this.showErrorMessage(data.error);
          }
        },
        error: (error) => {
          console.log(error);
          this.showErrorMessage(error.error.error);
        },
      });
    } else {
      this.showErrorMessage('Please fill in all fields of the form');
    }
  }

  pitchRating(rating: number): void {
    this.pitchScore = rating;
    this.myForm.get('pitchScore')?.setValue(rating);
  }

  gameDesignRating(rating: number): void {
    this.gameDesignScore = rating;
    this.myForm.get('gameDesignScore')?.setValue(rating);
  }

  artRating(rating: number): void {
    this.artScore = rating;
    this.myForm.get('artScore')?.setValue(rating);
  }

  buildRating(rating: number): void {
    this.buildScore = rating;
    this.myForm.get('buildScore')?.setValue(rating);
  }

  audioRating(rating: number): void {
    this.audioScore = rating;
    this.myForm.get('audioScore')?.setValue(rating);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////Lógica de Interfaz///////////////////////////////////////////////////////  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

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
}