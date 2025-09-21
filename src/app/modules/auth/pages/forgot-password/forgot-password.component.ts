import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { toast } from 'ngx-sonner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from '../../service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  constructor(
    private readonly _formBuilder: FormBuilder, 
    private readonly _router: Router,
    private afAuth: AngularFireAuth, 
    private readonly authService: AuthService,) {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  async resetPassword() {
    if (this.forgotPasswordForm.invalid) return;
  
    const email = this.forgotPasswordForm.value.email;
    try {
      await this.authService.resetPassword(email);
      toast.success('Correo de recuperación enviado', { position: 'top-right' });
    } catch (error) {
      toast.error('Error al enviar correo: ' + error, { position: 'top-right' });
    }
  }
  
  

}
