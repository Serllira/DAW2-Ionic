import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {AlertController, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule, AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {NgxErrorsModule} from '@ultimate/ngxerrors';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {SignupPage} from "../pages/signup/signup";

import {environment} from '../environments/environment';

import {AuthService} from "../services/auth.service";
import {RoomPage} from "../pages/room/room";
import {AddRoomPage} from "../pages/add-room/add-room";
import {BanUserPage} from "../pages/ban-user/ban-user";
import {BannedPage} from "../pages/banned/banned";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    RoomPage,
    AddRoomPage,
    BanUserPage,
    BannedPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxErrorsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    RoomPage,
    AddRoomPage,
    BanUserPage,
    BannedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AngularFireAuthModule,
    AuthService,
    AlertController,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
