import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../../models/ticket';
import { toast } from 'ngx-sonner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../../service/ticket.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../management/models/user';
import { Observable } from 'rxjs';
import { UserService } from '../../../../management/service/user.service';
import { AuthService } from '../../../../auth/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ticket-modal',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,CommonModule],
  templateUrl: './add-ticket-modal.component.html',
  styleUrl: './add-ticket-modal.component.scss',
})
export class AddTicketModalComponent {
  @Input() isOpen = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  ticketForm: FormGroup;
  @Input() ticket!: Ticket;
  users$: Observable<User[]> = this.userService.getAllUsers();
  user: User | null = null;
  filteredUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.ticketForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      fechaCreacion: ['', [Validators.required]],
      usuarioSolicitante: ['', [Validators.required]],
      asignadoA: ['',[Validators.required]],
    });
  }

  ngOnInit() {
    this.users$ = this.userService.getAllUsers();
    if (this.ticket) {
      this.ticketForm.patchValue({
        titulo: this.ticket.titulo,
        descripcion: this.ticket.descripcion,
        categoria: this.ticket.categoria,
        estado: this.ticket.estado,
        prioridad: this.ticket.prioridad,
        fechaCreacion: this.ticket.fechaCreacion,
        usuarioSolicitante: this.ticket.usuarioSolicitante,
        asignadoA: this.ticket.asignadoA,
      });
    }
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userService.getUserData(user.uid).subscribe(userData => {
          this.user = userData;
          this.ticketForm.patchValue({
            usuarioSolicitante: this.user?.name,
          });
    
          this.users$.subscribe(users => {
            this.filteredUsers = users.filter(u => u.uid !== this.user?.uid);
            if (this.filteredUsers.length > 0 && !this.ticketForm.get('asignadoA')?.value) {
              const firstUser = this.filteredUsers[0];
              this.ticketForm.patchValue({
                asignadoA: firstUser.name,
              });
            }
          });
        });
      }
    });
    
  }

  addTicket() {
    if (this.ticketForm.valid) {
      const ticket: Ticket = this.ticketForm.value;
      const assignedUser = this.filteredUsers.find(user => user.name === ticket.asignadoA);
  
      if (assignedUser) {
        ticket.asignadoA = assignedUser.name;
      }
  
      if (this.ticket && this.ticket.id) {
        // Edit the existing ticket
        this.ticketService.updateTicket(this.ticket.id, ticket)
          .then(() => {
            toast.success('Ticket editado exitosamente.', {
              position: 'top-right',
              action: {
                label: 'Deshacer',
                onClick: () => console.log('¡Acción deshecha!'),
              },
              actionButtonStyle: 'background-color:#DC2626; color:white;',
            });
            this.closeModal();
          })
          .catch((error) => {
            toast.error('Hubo un error al editar el ticket.', {
              position: 'top-right',
            });
            console.error('Error al editar el ticket: ', error);
            
            // Redirigir según el código de error
            if (error.status === 404) {
              this.router.navigate(['/errors/404']);
            } else if (error.status === 500) {
              this.router.navigate(['/errors/500']);
            }
          });
      } else {
        // Create a new ticket
        this.ticketService.addTicket(ticket).subscribe({
          next: () => {
            toast.success('Ticket agregado exitosamente.', {
              position: 'top-right',
              action: {
                label: 'Deshacer',
                onClick: () => console.log('¡Acción deshecha!'),
              },
              actionButtonStyle: 'background-color:#DC2626; color:white;',
            });
            this.closeModal();
          },
          error: (error) => {
            toast.error('Hubo un error al agregar el ticket.', {
              position: 'top-right',
            });
            console.error('Error al agregar el ticket: ', error);
            
            // Redirigir según el código de error
            if (error.status === 404) {
              this.router.navigate(['/errors/404']);
            } else if (error.status === 500) {
              this.router.navigate(['/errors/500']);
            }
          },
        });
      }
    } else {
      toast.error('Por favor, complete todos los campos correctamente.', {
        position: 'top-right',
      });
    }
  }
    

  closeModal() {
    this.closeModalEvent.emit();
  }
}
