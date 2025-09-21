import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, finalize, map, switchMap } from 'rxjs';
import { User } from '../models/user';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Roles } from '../../auth/models/Roles.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private collectionName = 'Users';
  private readonly adminEmail = 'nexgentechnologies2024@gmail.com';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth) {}

    createUser(uid: string, email: string, name: string = '', image: string): Promise<void> {
    const role = email === this.adminEmail ? Roles.Admin : Roles.User;

    return this.firestore.collection(this.collectionName).doc(uid).set({
      name: name,
      email: email,
      uid: uid,
      image: image,
      Roles: [role],
      createdAt: new Date(),
    });
  }


  getUserData(uid: string): Observable<User> {
    return this.firestore.collection(this.collectionName).doc(uid).valueChanges() as Observable<User>;
  }


  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>(this.collectionName).valueChanges().pipe(
      map(users => users.map(user => ({
        ...user,
        createdAt: typeof user.createdAt === 'number' ? new Date(user.createdAt * 1000) : new Date()
      })))
    );
  }


  uploadImage(file: File, uid: string, name: string): Observable<string> {
    const filePath = `users/${uid}/${name}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
  
    return task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          (url) => {
            console.log('Imagen cargada correctamente: ', url);
          },
          (error) => {
            console.error('Error al obtener la URL de la imagen: ', error);
          }
        );
      }),
      switchMap(() => fileRef.getDownloadURL()),
    );
  }

  updateSelectedStatus(uid: string, status: boolean): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(uid).update({ status });
  }
  
  listenAuthState(): Observable<User | null> {
    return this.auth.authState.pipe(
      switchMap((user): Observable<User | null> => {
        if (user) {
          this.updateSelectedStatus(user.uid, true);
          return this.getUserData(user.uid);
        } else {
          return of(null);
        }
      })
    );
  }


  async logout(): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await this.updateSelectedStatus(user.uid, false);
    }
    await this.auth.signOut();
  }
  
}