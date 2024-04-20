import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jammer-team',
  templateUrl: './jammer-team.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./jammer-team.component.css']
})
export class JammerTeamComponent {

  members = [
    { id: 1, name: 'David Pastor Barrientos', discord: 'Aldokler', email: 'xdavidpastor@gmail.com' },
    { id: 2, name: 'Atlas09 Herrera', discord: 'Adrian', email: 'maenomesesucorreo@gmail.com' },
  ];
  possibleMembers: any[] = [
    { id: 3, name: 'Pedro Pascal', discord: 'pedritpo', email: 'pedritpo@gmail.com' },
    { id: 4, name: 'Miguel Ángel', discord: 'migue123', email: 'migue23@gmail.com' },
  ];
  
  showAddMemberModal: boolean = false;
  suggestionsVisible: boolean = false;
  isTriangleUp: boolean = true; 
  newMember: any = {};
  nameSuggestions: any[] = [];
  memberNameSuggestions: any[] = []; 
  filteredSuggestions: any[] = [];

  toggleSuggestionsVisibility() {
    this.suggestionsVisible = !this.suggestionsVisible;
    this.toggleTriangleDirection();
  }

  toggleTriangleDirection() {
    this.isTriangleUp = !this.isTriangleUp;
  }

  toggleAddMemberModal() {
    this.showAddMemberModal = !this.showAddMemberModal;
    if (!this.showAddMemberModal) {
      this.clearForm();
    }
    this.filteredSuggestions = [];
  }
  


  suggestNames(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.suggestionsVisible = true; 
  
    if (searchTerm === '') {
      this.filteredSuggestions = [...this.possibleMembers];
      this.clearNewMember(); 
    } else {
      this.filteredSuggestions = this.possibleMembers.filter(member =>
        member.name.toLowerCase().startsWith(searchTerm)
      );
    }
  }
  

  
  
clearInputOnBackspace(event: KeyboardEvent) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.newMember.email = "";
      this.newMember.discord = "";
    }
  }
  
  clearNewMember() {
    this.newMember = {};
  }

  selectSuggestion(selectedMember: any) {
    this.newMember.name = selectedMember.name;
    this.newMember.email = selectedMember.email;
    this.newMember.discord = selectedMember.discord;
    this.filteredSuggestions = [];
  }
  

  addMember() {
    if (this.newMember.email && this.newMember.name && this.newMember.discord) {
      const newMemberCopy = { ...this.newMember };
      this.members.push(newMemberCopy);
      this.memberNameSuggestions.push(newMemberCopy.name);
      this.clearForm();
    }
  }

  clearForm() {
    this.newMember = {};
    this.filteredSuggestions = []; 
  }

  leaveTeam() {

  }
}