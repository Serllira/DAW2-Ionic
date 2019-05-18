import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BannedPage } from './banned';

@NgModule({
  declarations: [
    BannedPage,
  ],
  imports: [
    IonicPageModule.forChild(BannedPage),
  ],
})
export class BannedPageModule {}
