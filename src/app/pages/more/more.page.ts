import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NavController } from '@ionic/angular';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

  public noOfItems = 0;

  constructor(public appService: AppService,
    private navCtrl: NavController,
    private authService : AuthService) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    if (cart != null) 
    {
      this.noOfItems = cart.length;
    }
    else{
      this.noOfItems = 0;
    }
  }


  goToCartPage() {
    this.navCtrl.navigateForward('/app/tabs/cart');
  }

  goToTermsPage() {
    this.navCtrl.navigateForward('/app/tabs/more/terms');
  }

  goToPrivacyPage() {
    this.navCtrl.navigateForward('/app/tabs/more/privacy');
  }

  goToLocationPage() {
    this.navCtrl.navigateForward('/app/tabs/more/location');
  }

  goToOrdersPage(){
    this.navCtrl.navigateForward('/app/tabs/more/orders');
  }

  logoff(){
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }


}
