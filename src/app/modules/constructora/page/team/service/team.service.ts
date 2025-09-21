import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, from, Observable, switchMap } from 'rxjs';
import Papa from 'papaparse';
import { Team } from '../team.component';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private collectionName = 'Teams';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  addTeam(team: Team) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          team = { ...team, uid: user.uid };
          return this.firestore.collection<Team>(this.collectionName).add(team);
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getTeams() {
    return this.afAuth.authState.pipe(
      filter((user) => !!user),
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Team>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getTeamById(teamId: string) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Team>(this.collectionName)
            .doc(teamId)
            .valueChanges();
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  updateTeam(teamId: string, updatedTeam: Team) {
    return this.firestore
      .collection<Team>(this.collectionName)
      .doc(teamId)
      .update(updatedTeam);
  }

  deleteTeam(teamId: string) {
    return this.firestore
      .collection<Team>(this.collectionName)
      .doc(teamId)
      .delete();
  }

  deleteSelectedTeams(teamIds: string[]): Observable<void> {
    return from(this.afAuth.authState).pipe(
      filter(user => !!user),
      switchMap(() => {
        const batch = this.firestore.firestore.batch();
        teamIds.forEach(teamId => {
          const docRef = this.firestore.collection(this.collectionName).doc(teamId).ref;
          batch.delete(docRef);
        });
        return from(batch.commit());
      })
    );
  }

  addMultipleTeams(teams: Team[]): Observable<any> {
    return this.afAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => {
        const batch = this.firestore.firestore.batch();
        const collectionRef = this.firestore.collection(this.collectionName).ref;

        teams.forEach((team) => {
          const docRef = collectionRef.doc();
          batch.set(docRef, { ...team, uid: user?.uid });
        });

        return from(batch.commit());
      })
    );
  }

  importTeamsFromCSV(file: File): Observable<void> {
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
                const importedTeams: Team[] = result.data.map((row: any, index: number) => ({
                  id: this.firestore.createId(),
                  name: row[0] || `Equipo ${index + 1}`,
                  description: row[1] || 'Sin descripción',
                  department: row[2] || 'Sin departamento',
                  status: row[3] || 'Activo',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  uid: user.uid,
                }));

                this.addMultipleTeams(importedTeams).subscribe({
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