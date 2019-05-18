
import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {AuthService} from "../../services/auth.service";

@IonicPage()
@Component({
  selector: 'page-banned',
  templateUrl: 'banned.html',
})
export class BannedPage {
  baneados = [];
  rooms = [];
  ref = firebase.database().ref('listaNegra/');
  ref2 = firebase.database().ref();

  constructor(private auth: AuthService, public loadingController: LoadingController, public alertController: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BannedPage');
    // this.ref.on('value', resp => {
    //   this.baneados = [];
    //   this.baneados = snapshotToArray(resp);
    // });

    let loader = this.loadingController.create({
      content: 'Cargando usuarios baneados ...',
      // spinner: 'dots',
      duration: 30000
    });
    loader.present().then(()=>{
      this.auth.getBans()
        .subscribe((data)=> {
          this.baneados=data;
          loader.dismiss();
        });
    })

    this.auth.getRooms().subscribe((data)=> this.rooms=data);
  }

  hola(){
    console.log("hola", this.baneados);
  }

  presentAlert(usuario) {
    let alert = this.alertController.create({
      title: 'Usuario desbaneado',
      subTitle: 'El usuario ' + usuario + ' ya está desbaneado',
      buttons: ['OK']
    });
    alert.present();
  }

  unban2(e,item){
    var db = this.ref2;
    this.ref.on("value",
      (snapshot) =>
        snapshot.forEach(function(childSnapshot) {
          var pkey = childSnapshot.key;
          var chval = childSnapshot.val();

          if(chval.roomname === item.roomname && chval.usuario == item.usuario){
            db.child("listaNegra/"+pkey).remove();
          }

        }));
    //this.navCtrl.setRoot(RoomPage);
    console.log(e);
  }

  unban(e,item) {
    let alert = this.alertController.create({
      title: 'Desbanear usuario',
      message: '¿Estás seguro de que quiere desbanear al usuario: ' + item.usuario +'?',
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
            this.unban2(e,item);
            this.presentAlert(item.usuario);
          }
        }
      ]
    });
    alert.present();
  }

  nombresala(roomname){
      for(let baneado of this.baneados){
        if(roomname===baneado.roomname) {
          return true;
        }
    }
    return false;
  }


}
