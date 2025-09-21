import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../../team/service/team.service';
import { Team, TeamMember } from '../../../../team/team.component';

@Component({
  selector: 'app-add-team-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-team-modal.component.html',
  styleUrl: './add-team-modal.component.scss'
})
export class AddTeamModalComponent implements OnInit, OnChanges {
  @Input() team: Team | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveTeam = new EventEmitter<Team>();

  teamForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private teamService: TeamService) {}

  ngOnInit() {
    this.initForm();
    if (this.team) {
      this.patchFormWithTeam();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team'] && this.teamForm) {
      this.patchFormWithTeam();
    }
  }

  initForm() {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      department: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['', [Validators.required, Validators.maxLength(30)]],
      members: this.fb.array([]),
    });
  }

  patchFormWithTeam() {
    if (this.team) {
      // Limpiar arrays existentes
      this.clearFormArrays();
      
      // Parchar valores básicos
      this.teamForm.patchValue({
        name: this.team.name,
        department: this.team.department,
        description: this.team.description,
        status: this.team.status || 'Activo',
      });

      // Parchar miembros
      if (this.team.members) {
        this.team.members.forEach(member => {
          this.addMember(member);
        });
      }
    }
  }

  clearFormArrays() {
    while (this.membersArray.length !== 0) {
      this.membersArray.removeAt(0);
    }
  }

  // Getters para FormArrays
  get membersArray() { return this.teamForm.get('members') as FormArray; }

  // Métodos para Miembros
  addMember(existingMember?: TeamMember) {
    const memberGroup = this.fb.group({
      name: [existingMember?.name || '', Validators.required],
      email: [existingMember?.email || '', [Validators.required, Validators.email]],
      role: [existingMember?.role || '', Validators.required],
      phone: [existingMember?.phone || '']
    });
    this.membersArray.push(memberGroup);
  }

  removeMember(index: number) {
    this.membersArray.removeAt(index);
  }

  // Método para enviar el formulario
  onSubmit() {
    this.isSubmitting = true;
    
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const formValue = this.teamForm.value;
    const teamData: Team = {
      id: this.team?.id || '',
      name: formValue.name,
      description: formValue.description,
      department: formValue.department,
      status: formValue.status,
      createdAt: this.team?.createdAt || new Date().toISOString(),
      uid: this.team?.uid || '',
      members: formValue.members
    };

    if (this.team?.id) {
      // Actualizar equipo existente
      this.teamService.updateTeam(this.team.id, teamData).then(() => {
        this.saveTeam.emit(teamData);
        this.closeModal();
        this.isSubmitting = false;
      }).catch((error: any) => {
        console.error('Error updating team:', error);
        this.isSubmitting = false;
      });
    } else {
      // Crear nuevo equipo
      this.teamService.addTeam(teamData).subscribe({
        next: () => {
          this.saveTeam.emit(teamData);
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Error creating team:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
} 