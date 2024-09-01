import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {
  private storage;
  private auth;

  firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: 'gs://da-bubble-f85f7.appspot.com',
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  }

  constructor() {
    const firebaseApp = initializeApp(this.firebaseConfig);
    this.storage = getStorage(firebaseApp);
    this.auth = getAuth(firebaseApp);
  }

  async uploadFile(filePath: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async getFileUrl(filePath: string): Promise<string> {
    const storageRef = ref(this.storage, filePath);
    return await getDownloadURL(storageRef);
  }

  async deleteFile(filePath: string): Promise<void> {
    const storageRef = ref(this.storage, filePath);
    await deleteObject(storageRef);
  }
}
