import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurbsidePickupPageRoutingModule } from './curbside-pickup-routing.module';

import { CurbsidePickupPage } from './curbside-pickup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurbsidePickupPageRoutingModule
  ],
  declarations: [CurbsidePickupPage]
})
export class CurbsidePickupPageModule {}
