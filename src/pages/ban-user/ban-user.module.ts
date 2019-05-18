import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BanUserPage } from './ban-user';

@NgModule({
  declarations: [
    BanUserPage,
  ],
  imports: [
    IonicPageModule.forChild(BanUserPage),
  ],
})
export class BanUserPageModule {}
