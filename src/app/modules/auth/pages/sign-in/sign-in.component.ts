import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  isLoading = false;
  isSuccessLoading = false;

  constructor(
    private readonly _formBuilder: FormBuilder, 
    private readonly _router: Router,
    private readonly authService: AuthService) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.form.value;

    try {
      await this.authService.signIn(email, password);
      this.isLoading = false;
      this.isSuccessLoading = true;
      toast.success('Inicio de sesión exitoso', { position: 'top-right' });
      
      // Simular tiempo de carga para mostrar el loading de éxito
      setTimeout(() => {
        this.isSuccessLoading = false;
      }, 2000);
      
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      
      // Mostrar el mensaje de error específico
      if (error.message === 'INVALID_LOGIN_CREDENTIALS') {
        toast.error('Credenciales inválidas. Verifica tu email y contraseña.', {
          position: 'top-right',
        });
      } else {
        toast.error(error.message, {
          position: 'top-right',
        });
      }
    } finally {
      this.isLoading = false;
    }
  }
}
