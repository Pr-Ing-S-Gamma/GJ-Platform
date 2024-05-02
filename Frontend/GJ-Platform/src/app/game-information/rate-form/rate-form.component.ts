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
  rating: number[] = []
  pitchScore: Number | undefined;
  pitchFeedback: String | undefined;
  gameDesignScore: Number | undefined;
  gameDesignFeedback: String | undefined;
  artScore: Number | undefined;
  artFeedback: String | undefined;
  buildScore: Number | undefined;
  buildFeedback: String | undefined;
  audioScore: Number | undefined;
  audioFeedback: String | undefined;
  generalFeedback: String | undefined;
  evaluando: boolean | undefined;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private SubmissionService: SubmissionService) {
    for (let i = 1; i <= 10; i++) {
      this.rating.push(i);
    }
    this.evaluando = true;
  }
  
  ngOnInit(): void {
    this.SubmissionService.getRating("http://localhost:3000/api/submission/get-rating/" + this.game).subscribe({
      next: (data) => {
        console.log(data);
        //básicamente asigna cada campo del form para calificar
        this.pitchScore = data.pitchScore !== undefined ? data.pitchScore: 0;
        this.pitchRating(this.pitchScore.valueOf());
        this.pitchFeedback = data.pitchFeedback !== undefined ? data.pitchFeedback : '';
        this.gameDesignScore = data.gameDesignScore !== undefined ? data.gameDesignScore : 0;
        this.gameDesignRating(this.gameDesignScore.valueOf());
        this.gameDesignFeedback = data.gameDesignFeedback !== undefined ? data.gameDesignFeedback : '';
        this.artScore = data.artScore !== undefined ? data.artScore : 0;
        this.artRating(this.artScore.valueOf());
        this.artFeedback = data.artFeedback !== undefined ? data.artFeedback : '';
        this.buildScore = data.buildScore !== undefined ? data.buildScore : 0;
        this.buildRating(this.buildScore.valueOf());
        this.buildFeedback = data.buildFeedback !== undefined ? data.buildFeedback : '';
        this.audioScore = data.audioScore !== undefined ? data.audioScore : 0;
        this.audioRating(this.audioScore.valueOf());
        this.audioFeedback = data.audioFeedback !== undefined ? data.audioFeedback : '';
        this.generalFeedback = data.generalFeedback !== undefined ? data.generalFeedback : '';
        this.myForm = this.fb.group({
          pitchScore: this.pitchScore,
          pitchFeedback: this.pitchFeedback,
          gameDesignScore: this.gameDesignScore,
          gameDesignFeedback: this.gameDesignFeedback,
          artScore: this.artScore,
          artFeedback: this.artFeedback,
          buildScore: this.buildScore,
          buildFeedback: this.buildFeedback,
          audioScore: this.audioScore,
          audioFeedback: this.audioFeedback,
          generalFeedback: this.generalFeedback
        });
      },
      error: (error) => {
        console.log(error);
        this.showErrorMessage(error.error.error);
      },
    });
  }

  submitEvaluation(): void{
    console.log("Guardando la info pa")
    if (this.myForm.valid) {
      var rating = {
        submissionId: this.game,
        generalFeedback: this.myForm.value["generalFeedback"],
        pitchScore: this.pitchScore,
        pitchFeedback: this.myForm.value["pitchFeedback"],
        gameDesignScore: this.gameDesignScore,
        gameDesignFeedback: this.myForm.value["gameDesignFeedback"],
        artScore: this.artScore,
        artFeedback: this.myForm.value["artFeedback"],
        buildScore: this.buildScore,
        buildFeedback: this.myForm.value["buildFeedback"],
        audioScore: this.audioScore,
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
    //this.myForm.get('pitchScore')?.setValue(rating);
  }

  gameDesignRating(rating: number): void {
    this.gameDesignScore = rating;
    //this.myForm.get('gameDesignScore')?.setValue(rating);
  }

  artRating(rating: number): void {
    this.artScore = rating;
    //this.myForm.get('artScore')?.setValue(rating);
  }

  buildRating(rating: number): void {
    this.buildScore = rating;
    //this.myForm.get('buildScore')?.setValue(rating);
  }

  audioRating(rating: number): void {
    this.audioScore = rating;
    //this.myForm.get('audioScore')?.setValue(rating);
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