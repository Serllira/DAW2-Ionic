import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content, AlertController, LoadingController} from 'ionic-angular';
import {RoomPage} from '../room/room';
import * as firebase from 'firebase/app';
import {AuthService} from "../../services/auth.service";
import {BanUserPage} from "../ban-user/ban-user";
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

  data = {type: '', nickname: '', message: ''};
  chats:any;
  roomkey: string;
  nickname: string;
  offStatus:boolean = false;
  roomname: any;
  createdBy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, public afDB: AngularFireDatabase, public alertController: AlertController,  public loadingController: LoadingController) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nick") as string;
    this.roomname = this.navParams.get("roomname");
    this.createdBy = this.navParams.get("createdBy");
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref('chatrooms/' + this.roomname + '/chats').push();
    joinData.set({
      type: 'join',
      user: this.nickname,
      message: this.nickname + ' se ha unido a la sala.',
      sendDate: Date()
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TournamentsPage');

    let loader = this.loadingController.create({
      content: 'Cargando sala ...',
      // spinner: 'dots',
       duration: 30000
    });
    loader.present().then(()=>{
      this.auth.getChat(this.roomname)
        .subscribe((data)=> {
          this.chats=data;
          loader.dismiss();
          this.data.message="";
          setTimeout(() => {
            if(this.offStatus === false) {
              this.content.scrollToBottom(300);
            }
            if(this.content._scroll){
              this.content.scrollToBottom(0);
            }
          }, 100);
        });
    })

  }

  sendMessage() {
    this.auth.sendMessage(this.roomkey, this.data.type, this.data.nickname, this.data.message, this.roomname);
  }


  exitChat() {
    this.auth.exitChat(this.roomkey, this.nickname,this.roomname)

    this.offStatus = true;

     this.navCtrl.setRoot(RoomPage);
  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Sala borrada',
      subTitle: 'La sala ' + this.roomname + ' se ha borrado con éxito',
      buttons: ['OK']
    });
    alert.present();
  }

  banUser() {
    this.navCtrl.push(BanUserPage, {roomkey: this.roomkey, roomname: this.roomname});
  }

  deleteRoom(){
      //this.afDB.database.ref('rooms/'+ this.roomkey).remove();
      //this.presentAlert();
      //this.navCtrl.setRoot(RoomPage);
    this.presentConfirm();
  }

  presentConfirm() {
    let alert = this.alertController.create({
      title: 'Borrar sala',
      message: '¿Estás seguro de que quieres borrar esta sala?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.afDB.database.ref('rooms/'+ this.roomname).remove();
            this.afDB.database.ref('chatrooms/'+ this.roomname).remove();
            this.presentAlert();
            this.navCtrl.setRoot(RoomPage);
          }
        }
      ]
    });
    alert.present();
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

