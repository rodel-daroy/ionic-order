import { Component, OnInit } from '@angular/core';
import { Config, ModalController, NavParams, NavController } from '@ionic/angular';

@Component({
  selector: 'app-order-type-select',
  templateUrl: './order-type-select.component.html',
  styleUrls: ['./order-type-select.component.scss'],
})
export class OrderTypeSelectComponent implements OnInit {

  public ORDER_TYPE_CURBSIDE = 'Curbside';
  public ORDER_TYPE_TAKEOUT = 'Takeout';
  public ORDER_TYPE_DELIVERY = 'Delivery';

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }


  updateOrderType(type) {
    let orderType = {
      orderType: type
    }
    console.log(orderType);
    localStorage.setItem("orderInfo", btoa(JSON.stringify(orderType)));
    console.log(JSON.parse(atob(localStorage.getItem("orderInfo"))));
    if (type === this.ORDER_TYPE_CURBSIDE || type === this.ORDER_TYPE_TAKEOUT) { this.navCtrl.navigateForward('/select-restaurant'); }
    this.modalCtrl.dismiss();
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }


}
