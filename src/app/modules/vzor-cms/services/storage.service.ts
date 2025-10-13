import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  // Subir imagen a Firebase Storage
  uploadImage(file: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, `blog-images/${path}`);
    const uploadTask = uploadBytes(storageRef, file);
    
    return from(uploadTask.then(async (snapshot: any) => {
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }));
  }

  // Eliminar imagen de Firebase Storage
  deleteImage(imageUrl: string): Observable<void> {
    const imageRef = ref(this.storage, imageUrl);
    return from(deleteObject(imageRef));
  }

  // Generar nombre único para el archivo
  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }
}
