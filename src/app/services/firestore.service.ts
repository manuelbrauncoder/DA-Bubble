import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, DocumentChange, DocumentData, Firestore, onSnapshot, query } from '@angular/fire/firestore';
import { orderBy } from '@firebase/firestore';
import { UserInterface } from '../interfaces/user-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore = inject(Firestore);
  private http = inject(HttpClient);
  users: UserInterface[] = [];
  exampleUserDataUrl = 'assets/data/exampleUsers.json';


  exampleUsers: UserInterface[] = [];

  constructor() { }

  /**
   * fetch json from local url
   * just for example data
   * @returns 
   */
  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(this.exampleUserDataUrl);
  }

  /**
   * 
   * @param collRef Firebase Collection ID e.g. 'users' for Users
   * @returns the collection reference
   */
  getCollectionRef(collRef: string) {
    return collection(this.firestore, collRef);
  }

  /**
   * 
   * @param collRef Firebase Collection ID
   * @param docId Firebase Document ID
   * @returns the document reference
   */
  getDocumentRef(collRef: string, docId: string) {
    return doc(this.getCollectionRef(collRef), docId);
  }

  /**
   * Logging Changes in Firestore
   * call in onSnapshot method
   * @param change 
   */
  logChanges(change: DocumentChange<DocumentData>) {
    if (change.type === 'added') {
      console.log('New Data ', change.doc.data());
    }
    if (change.type === 'modified') {
      console.log('Modified Data: ', change.doc.data());
    }
    if (change.type === 'removed') {
      console.log('Removed Data: ', change.doc.data());
    }
  }


  /** Call this method in app-components.ts
   *  unsubscribe it with ngOnDestroy
   * 
   * Listen to a firebase collection, realtime updates, unsubscribe it in ngOnDestroy
   * orderBy: is just a example, more options are possible, look in firebase docu.
   * calls the docChanges method for updates in console.log
   *
   * @returns A function to unsubscribe from the Firestore snapshot listener.
   */
  getUsersList() {
    const q = query(this.getCollectionRef('users'), orderBy('username'));
    return onSnapshot(q, (list) => {
      this.users = [];
      list.forEach((element) => {
        const user = this.setUserObject(element.data(), element.id);
        this.users.push(user);
      });
      list.docChanges().forEach((change) => {
        this.logChanges(change);
      })
    })
  }

  /**
   * 
   * @param user 
   * @returns a clean json from UserInterface
   */
  getCleanUserJson(user: UserInterface) {
    return {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      date: user.date,
      img: user.img
    };
  }

  /**
   * 
   * @param user from firebase collection
   * @param id firebase id
   * @returns a UserInterface Object
   */
  setUserObject(user: any, id: string): UserInterface {
    return {
      id: id || '',
      email: user.email || '',
      userName: user.userName || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      date: user.date || '',
      img: user.img || []
    }
  }

  /**
   * Add user to Firestore Collection 'users'
   * UserInterface has to converted into a clean json
   * @param user 
   */
  async addUser(user: any) {
    await addDoc(this.getCollectionRef('users'), this.getCleanUserJson(user)).catch((err) => {
      console.log('Error adding User to Firebase', err);
    })
  }
}
