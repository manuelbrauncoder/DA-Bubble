/**
 * This Service handles up- and downloads to Firebase Storage
 */

import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FireStorageService {
  private storage;
  private auth;

  firebaseConfig = {
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'gs://da-bubble-f85f7.appspot.com',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id',
  };

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
      console.error('Error uploading file: ', error);
      throw new Error('File upload failed');
    }
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = files.map(async (file) => {
      const filePath = `uploads/${this.auth.currentUser?.uid}/${Date.now()}_${
        file.name
      }`;
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


  /**
   * Downloads a file from Firebase Storage given a file path
   * @param filePath to the file in firebase storage
   */
  async downloadFile(filePath: string) {
    try {
      const url = await getDownloadURL(ref(this.storage, filePath));
      const blob = await this.fetchBlob(url);
      const fileExtension = this.getFileExtension(blob.type);
      this.downloadBlob(blob, `downloadedFile${fileExtension}`);
    } catch (error) {
      console.error('Fehler beim Abrufen der Datei:', error);
    }
  }
  
  /**
   * Fetches the blob from a given URL
   * @param url 
   * @returns 
   */
  private fetchBlob(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new Error('Fehler beim Abrufen des Blobs'));
      xhr.open('GET', url);
      xhr.send();
    });
  }
  
  /**
   * 
   * @param mimeType of the file
   * @returns the corresponding file extension
   */
  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg': return '.jpg';
      case 'image/png': return '.png';
      case 'application/pdf': return '.pdf';
      default: return '';
    }
  }
  
  /**
   * Initiates the download of the given blob as a file
   * @param blob 
   * @param fileName 
   */
  private downloadBlob(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    const objectURL = URL.createObjectURL(blob);
    link.href = objectURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectURL);
  }
}
