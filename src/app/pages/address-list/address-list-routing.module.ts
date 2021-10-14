import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressListPage } from './address-list.page';

const routes: Routes = [
  {
    path: '',
    component: AddressListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressListPageRoutingModule {}
