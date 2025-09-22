import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { toast } from 'ngx-sonner';
import { CommonModule, NgIf } from '@angular/common';
import { UserService } from '../../../management/service/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AngularSvgIconModule, NgIf, ButtonComponent,CommonModule,RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  passwordStrength = 0;
  passwordStrengthArray = new Array(4);
  isSubmitting: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _authService: AuthService,
    private readonly _afAuth: AngularFireAuth,
    private readonly _User: UserService,

  ) {}

  async ngOnInit(): Promise<void> {
    this.form = this._formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [, [Validators.requiredTrue]],
      },
      {
        validators: this.matchPasswords('password', 'confirmPassword'),
      }
    );    
  
    const user = await this._afAuth.currentUser;
    if (user) {
      this._router.navigate(['/auth/sign-in']);
    }
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  private matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmControl = formGroup.controls[confirmPassword];
  
      if (confirmControl.errors && !confirmControl.errors['passwordMismatch']) {
        return;
      }
  
      if (passControl.value !== confirmControl.value) {
        confirmControl.setErrors({ passwordMismatch: true });
      } else {
        confirmControl.setErrors(null);
      }
    };
  }  

  async onSubmit() {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }
  
    const { email, password, name } = this.form.value;
    const trimmedEmail = email.trim();
  
    this.isSubmitting = true;
  
    try {
      // Crear usuario con la información del formulario
      await this._authService.signUp(name, trimmedEmail, password, '');
      toast.success('Usuario registrado exitosamente', { position: 'top-right' });
      this._router.navigate(['/auth/sign-in']);
    } catch (error: any) {
      console.error('Error al registrar usuario', error);
      toast.error('Error al registrar: ' + error.message, { position: 'top-right' });
    } finally {
      this.isSubmitting = false;
    }
  }  

  customEmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { 'invalidEmail': true };
  }
  

  onPasswordInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.passwordStrength = this.calculatePasswordStrength(value);
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;
    return strength;
  }

  checkPasswordUppercase(): boolean {
    const password = this.form.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  async onGoogleSignUp() {

  }

  
  openTerms() {
    window.open('https://www.vzorsuite.com/', '_blank');
  }
  
}
