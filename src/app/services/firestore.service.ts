import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentChange, DocumentData, Firestore, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { orderBy } from '@firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';
import { Message } from '../models/message.class';
import { Conversation, Participants } from '../models/conversation.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore = inject(Firestore);
  private http = inject(HttpClient);
  exampleUserDataUrl = 'assets/data/exampleUsers.json';
  private isDefaultChannelset = false;
  currentChannel: Channel = new Channel();
  currentConversation: Conversation = new Conversation();

  users: User[] = []; // all users stored here
  channels: Channel[] = []; // all channels stored here
  conversations: Conversation[] = []; // all conversations stored here
  

  exampleUsers: User[] = [];

  constructor() { }

  /**
   * fetch json from local url
   * just for example data
   * @returns 
   */
  fetchExampleUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.exampleUserDataUrl);
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
        const user = this.setUserObject(element.data());
        this.users.push(user);
      });      
      list.docChanges().forEach((change) => {
        this.logChanges(change);
      })
    })
  }

  /**
   * Called in app-components.ts for subscribing updates from firestore
   * @returns the channel list from firestore
   */
  getChannelList() {
    const q = query(this.getCollectionRef('channels'), orderBy('name'));
    return onSnapshot(q, (list) => {
      this.channels = [];
      list.forEach((element) => {
        const channel = this.setChannelObject(element.data(), element.id);
        this.channels.push(channel);
      });
      this.setActiveChannel();
      list.docChanges().forEach((change) => {
        this.logChanges(change);
      })
    })
  }

  getConversationList(){
    return onSnapshot(this.getCollectionRef('conversations'), (list) => {
      this.conversations = [];
      list.forEach((element) => {
        const conversation = this.setConversationObject(element.data(), element.id);
        this.conversations.push(conversation);
      });
      list.docChanges().forEach((change) => {
        this.logChanges(change);
      })
    })
  }

  setConversationObject(conversation: any, id: string): Conversation{
    return {
      id: id || '',
      participants: conversation.participants || new Participants,
      messages: conversation.messages || [],
      active: conversation.active || false
    }
  }

  /**
   * set first channel as active on first time loading channels
   */
  setActiveChannel(){
    if (this.channels.length > 0 && !this.isDefaultChannelset) {
      this.channels.forEach((channel)=>{
        if (this.channels[0].name === channel.name) {
          this.isDefaultChannelset = true;
          channel.channelActive = true;
          this.currentChannel = new Channel(this.channels[0]);
          
        } else {
          channel.channelActive = false;
        }
      })

    }
  }

  /**
   * Returns a Object with Class Channel
   * used in getChannelList() 
   */
  setChannelObject(channel: any, id: string): Channel{
    return {
      id: id || '',
      description: channel.description || '',
      name: channel.name || '',
      creator: channel.creator || '',
      users: channel.users || [],
      messages: channel.messages || [],
      comments: channel.comments || [],
      reactions: channel.reactions || [],
      data: channel.data || [],
      channelActive: channel.channelActive || false
    }
  }

  getCleanConversationJson(conversation: Conversation) {
    return {
      participants: this.getCleanParticipantsJson(conversation.participants),
      messages: conversation.messages.map(message => this.getCleanMessageJson(message))
    }
  }

  getCleanParticipantsJson(participant: Participants) {
    return {
      first: this.getCleanUserJson(participant.first),
      second: this.getCleanUserJson(participant.second)
    }
  }

  getCleanChannelJson(channel: Channel) {
    return {
      name: channel.name,
      description: channel.description,
      creator: channel.creator,
      users: channel.users.map(user => this.getCleanUserJson(user)),
      messages: channel.messages.map(message => this.getCleanMessageJson(message))
    }
  }

  getCleanMessageJson(message: Message) {
    return {
      time: message.time,
      sender: this.getCleanUserJson(message.sender),
      content: message.content,
      data: message.data,
      reactions: message.reactions
    }
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  getCleanUserJson(user: User) {
    return {
      uid: user.uid,
      email: user.email,
      username: user.username,
      currentlyLoggedIn: user.currentlyLoggedIn || false,
      avatar: user.avatar
    };
  }

  /**
   * 
   * @param user from firebase collection
   * @param id firebase id
   * @returns a UserInterface Object
   */
  setUserObject(user: any): User {
    return {
      uid: user.uid || '',
      email: user.email || '',
      username: user.username || '',
      createdAt: user.createdAt || 0,
      avatar: user.avatar || '',
      currentlyLoggedIn: user.currentlyLoggedIn || false
    }
  }
  
  async addUser(user: any) {
    const userid = user.uid;
    const userRef = doc(this.firestore, 'users', userid);
    const userData = this.getCleanUserJson(user);

    await setDoc(userRef, userData).catch((err) => {
      console.log('Error adding User to Firebase', err);
      
    })
  }

  
  /**
   * Add new channel to Firestore Collection 'channels'
   * convert class to clean json before pushing to firebase
   * @param channel 
   */
  async addChannel(channel: any) {
    await addDoc(this.getCollectionRef('channels'), this.getCleanChannelJson(channel)).catch((err) => {
      console.log('Error adding new Channel to Firebase', err); 
    })
  }

  async addConversation(conversation: any) {
    await addDoc(this.getCollectionRef('conversations'), this.getCleanConversationJson(conversation)).catch((err) => {
      console.log('Error adding new Conversation to Firebase', err);
    })
  }

  /**
   * Do not user for delete User!!
   * delete document from collection with id
   * @param docId document id
   * @param collection collection id
   */
  async deleteDocument(docId: string, collection: string) {
    let docRef = doc(this.getCollectionRef(collection), docId);
    await deleteDoc(docRef).catch((err) => {
      console.log('Error deleting Document', err);
    })
  }


  async updateChannel(channel: Channel) {
    let docRef = doc(this.getCollectionRef('channels'), channel.id);
    await updateDoc(docRef, this.getCleanChannelJson(channel)).catch((err)=>{
      console.log('Error updating Channel', err);
      
    })
  }

  async updateConversation(conversation: Conversation) {
    let docRef = doc(this.getCollectionRef('conversations'), conversation.id);
    await updateDoc(docRef,this.getCleanConversationJson(conversation)).catch((err) => {
      console.log('Error updating Conversation');
    })
  }
}
