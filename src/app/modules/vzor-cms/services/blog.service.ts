import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private collection = 'blog-posts';

  constructor(private firestore: Firestore) {}

  // GET - Obtener todos los posts
  getBlogPosts(): Observable<BlogPost[]> {
    const blogCollection = collection(this.firestore, this.collection);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(blogCollection, (querySnapshot) => {
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            ...data,
            id: doc.id
          } as BlogPost;
        });
        observer.next(posts);
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener un post por ID
  getBlogPost(id: string): Observable<BlogPost | undefined> {
    const blogDoc = doc(this.firestore, this.collection, id);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(blogDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;
          observer.next({
            ...data,
            id: docSnapshot.id
          } as BlogPost);
        } else {
          observer.next(undefined);
        }
      }, (error) => {
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  // GET - Obtener un post por ID (alias)
  getBlogPostById(id: string): Observable<BlogPost | undefined> {
    return this.getBlogPost(id);
  }

  // POST - Crear nuevo post
  createBlogPost(postData: CreateBlogPostRequest): Observable<void> {
    const newPost = {
      ...postData,
      sections: postData.sections.length > 0 ? postData.sections : [{
        f_title: '',
        f_subtitle: '',
        f_paragraph: '',
        f_img: [],
        f_media_links: []
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const blogCollection = collection(this.firestore, this.collection);
    return from(addDoc(blogCollection, newPost).then(() => {}));
  }

  // PUT - Actualizar post
  updateBlogPost(id: string, postData: UpdateBlogPostRequest): Observable<void> {
    const blogDoc = doc(this.firestore, this.collection, id);
    return from(updateDoc(blogDoc, {
      ...postData,
      updatedAt: new Date()
    }));
  }

  // DELETE - Eliminar post
  deleteBlogPost(id: string): Observable<void> {
    const blogDoc = doc(this.firestore, this.collection, id);
    return from(deleteDoc(blogDoc));
  }
}