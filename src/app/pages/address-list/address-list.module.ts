import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressListPageRoutingModule } from './address-list-routing.module';

import { AddressListPage } from './address-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressListPageRoutingModule
  ],
  declarations: [AddressListPage]
})
export class AddressListPageModule {}
