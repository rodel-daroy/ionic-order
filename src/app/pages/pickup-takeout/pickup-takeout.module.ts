import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickupTakeoutPageRoutingModule } from './pickup-takeout-routing.module';

import { PickupTakeoutPage } from './pickup-takeout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickupTakeoutPageRoutingModule
  ],
  declarations: [PickupTakeoutPage]
})
export class PickupTakeoutPageModule {}
