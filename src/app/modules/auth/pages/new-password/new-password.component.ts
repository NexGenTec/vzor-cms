import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toast } from 'ngx-sonner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, AngularSvgIconModule, ButtonComponent,ReactiveFormsModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewPasswordComponent implements OnInit {
  form!: FormGroup;
  passwordStrength = 0;
  passwordTextType!: boolean;
  confirmPasswordTextType: boolean = false;
  oobCode: string = '';
  submitted: any;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      if (params['oobCode']) {
        this.oobCode = params['oobCode'];
      } else {
        toast.error('Código de restablecimiento no válido.', { position: 'top-right' });
        this.router.navigate(['/auth/sign-in']);
      }
    });
  }

  onPasswordInput(): void {
    const password = this.form.get('password')?.value || '';
    this.passwordStrength = this.calculatePasswordStrength(password);
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;
    return strength;
  }

  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleConfirmPasswordTextType(): void {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  isPasswordMatch(): boolean {
    return this.form.get('password')?.value === this.form.get('confirmPassword')?.value;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      toast.error('Por favor, completa todos los campos correctamente.', { position: 'top-right' });
      return;
    }

    if (!this.isPasswordMatch()) {
      toast.error('Las contraseñas no coinciden.', { position: 'top-right' });
      return;
    }

    if (this.oobCode) {
      try {
        await this.afAuth.confirmPasswordReset(this.oobCode, this.form.get('password')?.value);
        toast.success('Contraseña restablecida con éxito.', { position: 'top-right' });
        this.router.navigate(['/auth/sign-in']);
      } catch (error: any) {
        toast.error('Error al restablecer la contraseña: ' + error.message, { position: 'top-right' });
      }
    } else {
      toast.error('Código de restablecimiento no válido.', { position: 'top-right' });
    }
  }
}
