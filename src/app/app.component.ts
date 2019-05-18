import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';

import {LoginPage} from "../pages/login/login";
import {AuthService} from "../services/auth.service";
import {RoomPage} from "../pages/room/room";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  pages;
  rootPage;

  private platform;
  private menu: MenuController;


  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform,
              menu: MenuController,
              private statusBar: StatusBar,
              private auth: AuthService) {

    this.menu = menu;
    this.platform = platform;
    this.initializeApp();
    this.pages = [
      {title: 'Salas', component: RoomPage, icon: 'home'},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });

    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.rootPage = RoomPage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }



}
