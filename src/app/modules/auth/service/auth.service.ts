import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UserService } from '../../management/service/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    private userService: UserService ) {
    this.afAuth.setPersistence('local').catch((error) => {
      console.error('Error configurando persistencia:', error);
    });
    const storedUser = sessionStorage.getItem('isAuthenticated');
    if (storedUser === 'true') {
      this.afAuth.authState.subscribe((user) => {
        this.userSubject.next(user);
      });
    }

    this.afAuth.authState.subscribe((user) => {
      this.userSubject.next(user);

      if (user) {
        sessionStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.removeItem('isAuthenticated');
      }
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential.user?.uid) {
        const user = await firstValueFrom(this.userService.getUserData(userCredential.user.uid));

        const idToken = await userCredential.user.getIdToken(true);

        sessionStorage.setItem('firebaseToken', idToken);
        this.userSubject.next(userCredential.user);
        await this.userService.updateSelectedStatus(userCredential.user.uid, true);
        sessionStorage.setItem('isAuthenticated', 'true');
        this.router.navigate(['/layout']);
      } else {
        throw new Error('UID no disponible');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      
      // Manejar errores específicos de Firebase Auth
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password') {
        throw new Error('INVALID_LOGIN_CREDENTIALS');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Demasiados intentos fallidos. Intenta más tarde.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('Esta cuenta ha sido deshabilitada.');
      } else {
        throw new Error('Error al iniciar sesión. Verifica tu conexión.');
      }
    }
  }
  
  async signUp(name: string, email: string, password: string, image: string): Promise<void> {
    try {
      // Intentar crear el usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user?.uid) {
        await this.userService.createUser(userCredential.user.uid, email, name, image);

        const idToken = await userCredential.user.getIdToken(true);

        sessionStorage.setItem('firebaseToken', idToken);
        this.userSubject.next(userCredential.user);
        this.router.navigate(['/layout']);
      } else {
        throw new Error('UID no disponible');
      }
    } catch (error:any) {
      console.error('Error al registrar usuario:', error as any);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('El correo electrónico ya está registrado. Intenta con otro.');
      } else {
        throw new Error('Error al registrar usuario: ' + error.message);
      }
    }
  }

  async autoLogoutIfNeeded(): Promise<void> {
    const isTokenExpired = await this.checkTokenExpiration();
    if (isTokenExpired) {
      await this.signOut();
      this.router.navigate(['/auth/sign-in']);
    }
  }

  private async checkTokenExpiration(): Promise<boolean> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        return false;
      }
      return true;
    } catch (error) {
      console.error('El token ha expirado o hubo un error al obtener el token', error);
      return true;
    }
  }
  
  async signOut(): Promise<void> {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await this.userService.updateSelectedStatus(user.uid, false);
      }
      await this.afAuth.signOut();
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('firebaseToken');
      this.router.navigate(['/auth/sign-in']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  getUser() {
    return this.userSubject.value;
  }
  
  async resetPassword(email: string): Promise<void> {
    try {
      const actionCodeSettings = {
        url: 'https://nexgenwebmaintainer.web.app/auth/new-password',
        handleCodeInApp: true,
      };
      await this.afAuth.sendPasswordResetEmail(email, actionCodeSettings);
    } catch (error: any) {
      console.error('Error al enviar correo de recuperación:', error);
      throw error;
    }
  }
  
}