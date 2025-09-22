import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private collection = 'blog-posts';

  constructor(private firestore: AngularFirestore) {}

  // GET - Obtener todos los posts
  getBlogPosts(): Observable<BlogPost[]> {
    return this.firestore.collection<BlogPost>(this.collection).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const docId = a.payload.doc.id;
        return { 
          ...data, 
          id: +docId,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as BlogPost;
      }))
    );
  }

  // GET - Obtener un post por ID
  getBlogPost(id: number): Observable<BlogPost | undefined> {
    return this.firestore.doc<BlogPost>(`${this.collection}/${id}`).valueChanges();
  }

  // POST - Crear nuevo post
  createBlogPost(postData: CreateBlogPostRequest): Observable<void> {
    const id = Date.now();
    const newPost: BlogPost = {
      id,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(this.firestore.doc(`${this.collection}/${id}`).set(newPost));
  }

  // PUT - Actualizar post
  updateBlogPost(id: number, postData: UpdateBlogPostRequest): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).update({
      ...postData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar post
  deleteBlogPost(id: number): Observable<void> {
    return from(this.firestore.doc(`${this.collection}/${id}`).delete());
  }
}