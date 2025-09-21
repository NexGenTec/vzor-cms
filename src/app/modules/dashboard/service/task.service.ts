import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Task } from '../models/task';
import { filter, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collectionName = 'Tasks';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  addTask(task: Task) {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          task = { ...task, uid: user.uid };
          return this.firestore.collection<Task>(this.collectionName).add(task);
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getTasks() {
    return this.afAuth.authState.pipe(
      filter((user) => !!user),
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection<Task>(this.collectionName, (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        }
        throw new Error('Usuario no autenticado');
      })
    );
  }

  getTasksById(tasktId: string) {
      return this.afAuth.authState.pipe(
        switchMap((user) => {
          if (user) {
            return this.firestore
              .collection<Task>(this.collectionName)
              .doc(tasktId)
              .valueChanges();
          }
          throw new Error('Usuario no autenticado');
        })
      );
    }

  updateTask(taskId: string, updatedTask: Task) {
    return this.firestore
      .collection<Task>(this.collectionName)
      .doc(taskId)
      .update(updatedTask);
  }

  deleteTask(taskId: string) {
    return this.firestore
      .collection<Task>(this.collectionName)
      .doc(taskId)
      .delete();
  }
}