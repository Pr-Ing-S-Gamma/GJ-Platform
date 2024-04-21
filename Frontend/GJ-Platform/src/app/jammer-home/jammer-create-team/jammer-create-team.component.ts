import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-jammer-create-team',
  standalone: true,
  imports: [],
  templateUrl: './jammer-create-team.component.html',
  styleUrls: ['./jammer-create-team.component.css']
})
export class JammerCreateTeamComponent implements OnInit{
  myForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private userService: UserService){
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      studioName: ['', Validators.required],
      gameJam: ['CIDEV 2024', Validators.required],
      site: ['tec-sanjose', Validators.required],
      region: ['LATAM', Validators.required]
    });
  }
  logOut(){
    this.userService.logOutUser('http://localhost:3000/api/user/log-out-user')
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al cerrar sesión:', error);
        }
      );
  }
  createTeam(){}
  
  
}
