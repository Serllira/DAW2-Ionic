import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from "rxjs";



@Injectable()
export class AuthService {
  private user: firebase.User;
  data:any;
  ref2 = firebase.database().ref('listaNegra/');


  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signup2(datos) {
    let key = this.afDB.list('/users/').push(datos).key;
    datos.id = key;
    this.afDB.database.ref('users/' + datos.id).set(datos);
  }

  getUserData(userData) {
    let user_data = [];
    firebase.database().ref().child("users").on('value', (snapshot) => {
      let result = snapshot.val();
      for (let k in result) {
        if (userData === result[k].email) {
          user_data.push({
            id: k,
            email: result[k].email,
            nick: result[k].nick,
            admin: result[k].admin
          });
        }

      }
    });
    return user_data;
  }


  //HomePage
  getChat(roomname):Observable<any>{
    return this.afDB.list('chatrooms/' + roomname + '/chats').valueChanges();
  }

  sendMessage(roomkey, type, nickname, message,roomname) {
    let newData = firebase.database().ref('chatrooms/' + roomname + '/chats').push();
    newData.set({
      type: type,
      user: nickname,
      message: message,
      sendDate: Date()
    });
  }

  exitChat(roomkey,nickname,roomname){
    let exitData = firebase.database().ref('chatrooms/' + roomname + '/chats').push();
    exitData.set({
      type: 'exit',
      user: nickname,
      message: nickname + ' ha abandonado la sala.',
      sendDate: Date()
    });

  }

  getRooms():Observable<any>{
    return this.afDB.list('rooms/').valueChanges();
  }

  getBans(){
    return this.afDB.list('listaNegra/').valueChanges();
  }


}

