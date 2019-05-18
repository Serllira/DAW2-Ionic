import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {RoomPage} from "../room/room";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  signupError: string;
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private navCtrl: NavController,
    private auth: AuthService
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      nick: []
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signup() {
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };
    let datos = {
      email: data.email,
      nick: data.nick,
      admin: false
    };
    this.auth.signUp(credentials).then(
      () => {
        this.auth.signup2(datos);
        this.navCtrl.push(RoomPage)
      },
      error => this.signupError = error.message
    );
  }

}
