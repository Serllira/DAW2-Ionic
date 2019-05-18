import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController} from 'ionic-angular';
import {AddRoomPage} from '../add-room/add-room';
import {AuthService} from '../../services/auth.service';
import {HomePage} from '../home/home';
import * as firebase from 'firebase/app';
import {BannedPage} from "../banned/banned";


@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms=[];
  baneados=[];
  ref = firebase.database().ref('rooms/');
  ref2 = firebase.database().ref('listaNegra/');

  constructor(public navCtrl: NavController, private auth: AuthService, public alertController: AlertController, public loadingController: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');

    let loader = this.loadingController.create({
      content: 'Cargando salas ...',
      // spinner: 'dots',
      duration: 30000
    });
    loader.present().then(()=>{
      this.auth.getRooms()
        .subscribe((data)=> {
          this.rooms=data;
          loader.dismiss();
          this.ref2.on('value', resp => {
            this.baneados = [];
            this.baneados = snapshotToArray(resp);
          });
        });
    })

  }



  joinRoom(key, roomname, createdBy) {
    let canJoin = true;
    for(let k in this.baneados){
      if (roomname === this.baneados[k].roomname && firebase.auth().currentUser.email === this.baneados[k].usuario) {
               canJoin = false;
               this.presentAlert();
             }
    }

    if (canJoin) {
           this.navCtrl.setRoot(HomePage, {
             key: key,
             //nick: this.auth.getEmail(),
             nick: this.getNick(),
             roomname: roomname,
             createdBy: createdBy
           });
         }

    // this.ref2.on("value", (snapshot) => {
    //   let result = snapshot.val();
    //   for (let k in result) {
    //     if (roomname === result[k].roomname && firebase.auth().currentUser.email === result[k].usuario) {
    //       canJoin = false;
    //       this.presentAlert();
    //     }
    //   }
    //   if (canJoin) {
    //     this.navCtrl.setRoot(HomePage, {
    //       key: key,
    //       //nick: this.auth.getEmail(),
    //       nick: this.getNick(),
    //       roomname: roomname,
    //       createdBy: createdBy
    //     });
    //   }
    // });

  }

  getNick(){
    for (let userData of this.auth.getUserData(this.auth.getEmail())){
      return userData.nick;
    }
  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Acceso bloqueado',
      subTitle: 'Has sido baneado de este chat',
      buttons: ['OK']
    });
    alert.present();
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  banned(){
    this.navCtrl.push(BannedPage);
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

