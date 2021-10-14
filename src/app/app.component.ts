import { Component } from '@angular/core';

import { AppService } from './services/app.service';
import { UtilityService } from './services/utility.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NavController } from '@ionic/angular';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  loggedIn = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    public appService: AppService,
    private statusBar: StatusBar,
    private navController: NavController,
    private fcmService: FcmService,
    private utilityService : UtilityService
  ) {
    this.initializeApp();
    this.checkLoginStatus();
    this.getSettingInfo();
    this.getBusinessInfo();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //Trigger Push Notification Setup
      //this.fcmService.initPush();
    });
  }

  private getSettingInfo() {
    this.appService.getSettingsData().valueChanges().subscribe((res: any) => {
      if (res && res.currency && res.currency.currencySymbol) {
        localStorage.setItem('currency', res.currency.currencySymbol);
      } else {
        localStorage.setItem('currency', '$');
      }
    });
  }

  private getBusinessInfo() {
    this.appService.getClientBusinessDetails().valueChanges().subscribe((res: any) => {
      if (res) {
        console.log(res.restaurantLocations);
        localStorage.setItem('businessData', JSON.stringify(res.restaurantLocations));
        localStorage.setItem('businessLatitude',res.latitude);
        localStorage.setItem('businessLongitude',res.longitude);
      } 
    });
    this.utilityService.checkIfRestaurantOpen();
  }


  checkLoginStatus() {
      if(localStorage.getItem('uid') != null)
      {
        this.navController.navigateRoot("/app/tabs/home");
      }
     else {
        this.navController.navigateRoot("/login");
      }
  }
}
