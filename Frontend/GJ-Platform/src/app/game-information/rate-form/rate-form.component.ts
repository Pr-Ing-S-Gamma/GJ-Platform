import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Category } from '../../../types';

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
  gameParameter!: String;
  selectedCategory: Category | null = null;
  rating: number[] = []
  pitchScore: number | undefined;
  gameDesignScore: number | undefined;
  artScore: number | undefined;
  buildScore: number | undefined;
  audioScore: number | undefined;
  evaluando: boolean | undefined;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    for (let i = 1; i <= 10; i++) {
      this.rating.push(i);
    }
    this.evaluando = true;
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameParameter = params['game'];
    });
    this.myForm = this.fb.group({
      pitchScore: ['', Validators.required],
      pitchFeedback: ['', Validators.required],
      gameDesignScore: ['', Validators.required],
      gameDesignFeedback: ['', Validators.required],
      artScore: ['', Validators.required],
      artFeedback: ['', Validators.required],
      buildScore: ['', Validators.required],
      buildFeedback: ['', Validators.required],
      audioScore: ['', Validators.required],
      audioFeedback: ['', Validators.required],
      generalFeedback: ['', Validators.required]
    });
  }

  submitEvaluation(): void{
    //Do something
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

}