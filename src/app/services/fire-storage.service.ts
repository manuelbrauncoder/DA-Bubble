/**
 * This Service handles up- and downloads to Firebase Storage
 */

import { Injectable } from '@angular/core';
import { initializeApp, getApps } from "firebase/app";
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
    let firebaseApp;
    if (!getApps().length) {
      firebaseApp = initializeApp(this.firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }

    this.storage = getStorage(firebaseApp);
    this.auth = getAuth(firebaseApp);
  }

  async uploadFile(filePath: string, file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading file: ", error);
      throw new Error('File upload failed');
    }
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = files.map(async file => {
      const filePath = `uploads/${this.auth.currentUser?.uid}/${Date.now()}_${file.name}`;
      return await this.uploadFile(filePath, file);
    });
  
    const urls = await Promise.all(uploadPromises);
    return urls;
  }

  async getFileUrl(filePath: string): Promise<string> {
    const storageRef = ref(this.storage, filePath);
    return await getDownloadURL(storageRef);
  }

  async deleteFile(filePath: string): Promise<void> {
    const storageRef = ref(this.storage, filePath);
    await deleteObject(storageRef);
  }

  extractFileName(filePath: string): string {
    if (filePath.startsWith('data:')) {
      return 'Vorschau';
    }
  
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }

  async downloadFile(filePath: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, filePath);
      const downloadURL = await getDownloadURL(storageRef);
  
      const a = document.createElement('a');
      a.href = downloadURL;
      
      a.setAttribute('download', this.extractFileName(filePath)); 
      document.body.appendChild(a);
      a.click();
  
      document.body.removeChild(a);
  
    } catch (error) {
      console.error("Error downloading file: ", error);
      throw new Error('File download failed');
    }
  }
}
