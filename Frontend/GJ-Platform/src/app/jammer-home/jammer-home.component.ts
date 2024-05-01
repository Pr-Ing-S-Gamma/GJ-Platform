import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { SiteService } from '../services/site.service';
import { GamejamService } from '../services/gamejam.service';
import { Router } from '@angular/router';
import { JammerCreateTeamComponent } from './jammer-create-team/jammer-create-team.component';
import { JammerTeamComponent } from './jammer-team/jammer-team.component';

@Component({
  selector: 'app-jammer-home',
  standalone: true,
  imports: [
    JammerCreateTeamComponent,
    CommonModule,
    JammerTeamComponent
  ],
  templateUrl: './jammer-home.component.html',
  styleUrl: './jammer-home.component.css'
})
export class JammerHomeComponent implements OnInit {
  targetTime: Date | undefined;
  timeRemaining: string | undefined;
  username: string | undefined;
  teamName: string | undefined;
  isHovered: boolean = false;
  showCreateTeam :boolean = false;
  showUpdateTeam :boolean = false;



  constructor(private router: Router, private teamService: TeamService, private userService: UserService, private siteService: SiteService, private gamejamService: GamejamService){
  }

  ngOnInit(): void {
    this.userService.getCurrentUser('http://localhost:3000/api/user/get-user')
      .subscribe(
        user => {
          if (user.rol === 'LocalOrganizer') {
            this.router.navigate(['/Games']);
          }
          if (user.rol === 'GlobalOrganizer') {
            this.router.navigate(['/DataManagement']);
          }
          this.username = user.name + "(" + user.discordUsername + ")";
          this.teamName = user.team?.name;
          this.gamejamService.getTimeRemainingData('http://localhost:3000/api/game-jam/get-time-left')
            .subscribe(
              timeLeft => {
                const timeParts = timeLeft.split(':').map((part: string) => parseInt(part, 10));
  
                if (timeParts.length !== 4 || timeParts.some(isNaN)) {
                  console.error("Invalid target time format");
                  return;
                }
  
                const [days, hours, minutes, seconds] = timeParts;
  
                const totalMilliseconds =
                  (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  
                this.targetTime = new Date(Date.now() + totalMilliseconds);
  
                if (this.targetTime instanceof Date) {
                  setInterval(() => {
                    this.updateTimer();
                  }, 1000);
                } else {
                  console.error("Invalid target time format");
                }
              },
              () => {}
            );
        },
        () => {}
      );
  }
  
  hideAll(){
    this.showCreateTeam = false;
  }

  toggleUpdateTeam(){
    this.hideAll()
    this.showUpdateTeam = true;
  }

  toggleCreateTeam(){
    this.hideAll()
    this.showCreateTeam = true;
  }
  updateTimer() {
    const now = new Date();
  
    if (this.targetTime instanceof Date) {
      const difference = this.targetTime.getTime() - now.getTime();
  
      if (difference <= 0) {
        this.timeRemaining = '0d 0h 0m 0s';
        return;
      }
  
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      let timeRemainingStr = '';
      if (days > 0) {
        timeRemainingStr += `${days}d `;
      }
      if (hours > 0) {
        timeRemainingStr += `${hours}h `;
      }
      if (minutes > 0) {
        timeRemainingStr += `${minutes}m `;
      }
      if (seconds > 0) {
        timeRemainingStr += `${seconds}s`;
      }
  
      this.timeRemaining = timeRemainingStr.trim();
    } else {
      this.timeRemaining = 'Target time not set';
    }
  }  
  
  
  redirectToTeamPage(): void {
    this.router.navigate(['/Jammer/Team']);
  }

  redirectToSubmitPage(): void {
    this.router.navigate(['/Jammer/Team']);
  }

}
