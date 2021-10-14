import { Component, OnInit } from '@angular/core';
import { AppService } from './../../services/app.service';
import { NavController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public orders;
  public currency;
  public noOfItems: number;

  constructor(public navCtrl: NavController,
    private appService: AppService,
    private alertCtrl: AlertController) {
    this.currency = localStorage.getItem('currency');
  }

  ionViewWillEnter() {
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    if (cart != null) this.noOfItems = cart.length;

  }


  async ngOnInit() {

    let loader = await this.appService.showLoading();
    this.appService.getOrders().snapshotChanges().subscribe((data: any) => {
      this.orders = [];
      data.forEach(item => {
        let temp = item.payload.toJSON();
        temp["_id"] = item.payload.key;
        this.orders.push(temp);
      });
      this.orders.reverse();
      loader.dismiss();
      console.log("Order Data" + JSON.stringify(this.orders))
    }, error => {
      loader.dismiss();
      console.log(error);
    })
  }

  orderDetails(orderId) {
    this.navCtrl.navigateForward('/app/tabs/more/order-details;orderId=' + orderId);
  }

  async cancelOrder(orderId) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Cancel Order!',
      message: 'Do you want to cancel your order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.appService.cancelOrder(orderId);
          }
        }
      ]
    });

    await alert.present();
  }

  goToCartPage() {
    this.navCtrl.navigateForward('/app/tabs/cart');
  }

  async presentAlertConfirm() {

  }

}
