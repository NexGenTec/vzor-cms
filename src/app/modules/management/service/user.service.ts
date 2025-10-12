import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, getDocs } from '@angular/fire/firestore';
import { Observable, finalize, map, switchMap, from } from 'rxjs';
import { User } from '../models/user';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Roles } from '../../auth/models/Roles.model';
import { Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private collectionName = 'Users';
  private readonly adminEmail = 'vzor-cms';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private auth: Auth) {
    
    // Console para verificar qué base de datos está usando Firestore
    console.log('🔍 UserService - Firestore config:', {
      firestore: this.firestore,
      collectionName: this.collectionName
    });
    
    // Mostrar información de la base de datos
    this.showDatabaseInfo();
    
    // Test database connection
    this.testDatabaseConnection();
  }

  private showDatabaseInfo(): void {
    console.log('🔍 DATABASE CONNECTION INFO:');
    console.log('📊 Project ID:', environment.firebaseConfig.projectId);
    console.log('🗄️ Database ID:', environment.firestoreConfig.databaseId);
    console.log('🔗 Full Path:', `projects/${environment.firebaseConfig.projectId}/databases/${environment.firestoreConfig.databaseId}`);
    console.log('🌍 Environment Config:', {
      projectId: environment.firebaseConfig.projectId,
      databaseId: environment.firestoreConfig.databaseId
    });
  }

  private testDatabaseConnection(): void {
    console.log('🧪 Testing database connection...');
    
    const testDoc = doc(this.firestore, 'test', 'connection');
    getDoc(testDoc).then((docSnapshot) => {
      console.log('✅ Database connection successful:', docSnapshot.exists() ? 'Document exists' : 'Document does not exist');
      console.log('📍 Connected to database:', `projects/${environment.firebaseConfig.projectId}/databases/${environment.firestoreConfig.databaseId}`);
    }).catch((error) => {
      console.error('❌ Database connection failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.log('📍 Attempted connection to:', `projects/${environment.firebaseConfig.projectId}/databases/${environment.firestoreConfig.databaseId}`);
    });
  }

  async createUser(uid: string, email: string, name: string = '', image: string): Promise<void> {
    const role = email === this.adminEmail ? Roles.Admin : Roles.User;
    const userDoc = doc(this.firestore, this.collectionName, uid);
    
    return setDoc(userDoc, {
      name: name,
      email: email,
      uid: uid,
      image: image,
      Roles: [role],
      createdAt: new Date(),
    });
  }


  getUserData(uid: string): Observable<User> {
    if (!uid) {
      return new Observable(observer => {
        observer.next(null as any);
        observer.complete();
      });
    }
    
    const userDoc = doc(this.firestore, this.collectionName, uid);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          observer.next(docSnapshot.data() as User);
        } else {
          observer.next(null as any);
        }
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  getAllUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, this.collectionName);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(usersCollection, (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: typeof doc.data()['createdAt'] === 'number' ? new Date(doc.data()['createdAt'] * 1000) : new Date()
        })) as User[];
        observer.next(users);
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }


  uploadImage(file: File, uid: string, name: string): Observable<string> {
    const filePath = `users/${uid}/${name}.jpg`;
    const fileRef = ref(this.storage, filePath);
    
    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => from(getDownloadURL(fileRef))),
      finalize(() => {
        console.log('Imagen cargada correctamente');
      })
    );
  }

  async updateSelectedStatus(uid: string, status: boolean): Promise<void> {
    const userDoc = doc(this.firestore, this.collectionName, uid);
    return updateDoc(userDoc, { status });
  }
  
  listenAuthState(): Observable<User | null> {
    return new Observable(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          await this.updateSelectedStatus(user.uid, true);
          // Obtener datos del usuario directamente
          const userDoc = doc(this.firestore, this.collectionName, user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            observer.next(userSnapshot.data() as User);
          } else {
            observer.next(null);
          }
        } else {
          observer.next(null);
        }
      });
      
      return () => unsubscribe();
    });
  }

  async logout(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await this.updateSelectedStatus(user.uid, false);
    }
    await signOut(this.auth);
  }

  // Método para verificar a qué base de datos se está conectando
  getCurrentDatabaseInfo(): void {
    this.showDatabaseInfo();
    this.testDatabaseConnection();
  }
  
}