import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null);
  
  constructor(
    private readonly fbAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly firestore: AngularFirestore
  ) {
    // Se escucha el estado de la autenticación
    this.fbAuth.authState.subscribe((user) => {
      console.log('Auth state changed: ', user);
      this.userSubject.next(user); 
    });
  }

    // Método para iniciar sesión
    async Login(email: string, password: string): Promise<any> {
      return this.fbAuth.signInWithEmailAndPassword(email, password);
    }
  
    // Método para registrar un nuevo usuario
    async register(email: string, password: string): Promise<any> {
      const userCredential = await this.fbAuth.createUserWithEmailAndPassword(email, password);
      const userID = userCredential.user?.uid;
      if (userID) {
        // Guardar los datos del usuario en Firestore 
        await this.firestore.collection('users').doc(userID).set({
          email,
          name: '',
          lastName: '',
          age: '',
          phone: '',
          imageUrl: ''
        });
      }
      return userCredential;
    }
  
    // Método para cerrar sesión
    async logout(): Promise<void> {
      return this.fbAuth.signOut();
    }
  
    // Método para obtener el token del usuario autenticado
    getToken(): string | null {
      const user = this.userSubject.value;
      if (user) {
        return user.getIdToken();  // Devuelve el token de autenticación
      }
      return null;
    }
  
    // Verificar si el usuario está autenticado
    isAuthenticated(): Observable<boolean> {
      return new Observable((observer) => {
        this.fbAuth.authState.subscribe((user) => {
          observer.next(!!user);  // Si hay un usuario logueado, está autenticado
        });
      });
    }
  
    // Método para obtener los datos del usuario desde Firestore
    async getUserData(userID: string) {
      try {
        const userDoc = await this.firestore.collection('users').doc(userID).get().toPromise();
  
        // Verificamos si userDoc existe y tiene datos
        if (!userDoc || !userDoc.exists) {
          throw new Error("El documento del usuario no existe.");
        }
  
        // Si existe, retornamos los datos del usuario
        return userDoc.data();
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        throw new Error('Error al obtener los datos del usuario');
      }
    }
  
    // Método para actualizar los datos del usuario
    async updateUser(userID: string, name: string, lastName: string, age: string, phone: string, email: string, imageUrl: string) {
      try {
        await this.firestore.collection('users').doc(userID).update({
          name,
          lastName,
          age,
          phone,
          email,
          imageUrl,
        });
      } catch (error) {
        console.error('Error actualizando los datos del usuario:', error);
        throw new Error('Error al actualizar los datos');
      }
    }
  }