import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectRestaurantPageRoutingModule } from './select-restaurant-routing.module';

import { SelectRestaurantPage } from './select-restaurant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectRestaurantPageRoutingModule
  ],
  declarations: [SelectRestaurantPage]
})
export class SelectRestaurantPageModule {}
