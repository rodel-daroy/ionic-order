import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurbsidePickupPage } from './curbside-pickup.page';

const routes: Routes = [
  {
    path: '',
    component: CurbsidePickupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurbsidePickupPageRoutingModule {}
