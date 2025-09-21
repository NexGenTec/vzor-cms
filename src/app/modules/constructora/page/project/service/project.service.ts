import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, from, Observable, switchMap } from 'rxjs';
import Papa from 'papaparse';
import { Project } from '../project.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private collectionName = 'Projects';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  addProject(project: Project) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          project = { ...project, uid: user.uid };
          return this.firestore.collection<Project>(this.collectionName).add(project);
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getProjects() {
    return this.afAuth.authState.pipe(
      filter((user) => !!user),
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Project>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getProjectById(projectId: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Project>(this.collectionName)
            .doc(projectId)
            .valueChanges();
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  updateProject(projectId: string, updatedProject: Project) {
    return this.firestore
      .collection<Project>(this.collectionName)
      .doc(projectId)
      .update(updatedProject);
  }

  deleteProject(projectId: string) {
    return this.firestore
      .collection<Project>(this.collectionName)
      .doc(projectId)
      .delete();
  }

  deleteSelectedProjects(projectIds: string[]): Observable<void> {
    return from(this.afAuth.authState).pipe(
      filter(user => !!user),
      switchMap(() => {
        const batch = this.firestore.firestore.batch();
        projectIds.forEach(projectId => {
          const docRef = this.firestore.collection(this.collectionName).doc(projectId).ref;
          batch.delete(docRef);
        });
        return from(batch.commit());
      })
    );
  }

  addMultipleProjects(projects: Project[]): Observable<any> {
    return this.afAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => {
        const batch = this.firestore.firestore.batch();
        const collectionRef = this.firestore.collection(this.collectionName).ref;

        projects.forEach((project) => {
          const docRef = collectionRef.doc();
          batch.set(docRef, { ...project, uid: user?.uid });
        });

        return from(batch.commit());
      })
    );
  }

  importProjectsFromCSV(file: File): Observable<void> {
    return new Observable<void>((observer) => {
      this.afAuth.authState.pipe(
        switchMap((user) => {
          if (!user) {
            observer.error('Usuario no autenticado');
            return [];
          }

          return new Observable((innerObserver) => {
            Papa.parse(file, {
              complete: (result) => {
                const importedProjects: Project[] = result.data.map((row: any, index: number) => ({
                  id: this.firestore.createId(), // Keep ID as string
                  name: row[0] || `Proyecto ${index + 1}`,
                  description: row[1] || 'Sin descripción',
                  category: row[2] || 'Sin categoría',
                  status: row[3] || 'Activo',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  // Agrega aquí más campos si tu modelo los necesita
                  uid: user.uid,
                }));

                this.addMultipleProjects(importedProjects).subscribe({
                  next: () => {
                    innerObserver.next();
                    innerObserver.complete();
                  },
                  error: (err) => {
                    innerObserver.error(err);
                  },
                });
              },
              error: (err) => {
                innerObserver.error(err);
              },
            });
          });
        })
      ).subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }
}