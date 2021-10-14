import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  navigateHome(){
    this.navCtrl.navigateRoot("/app/tabs/home");
  }

  navigateToMyOrders(){
    this.navCtrl.navigateRoot("/app/tabs/more/orders");
  }


}
