import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import {AuthService} from '../auth.service';
import { AppService } from '../../services/app.service';
import { HAMMER_LOADER } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navController: NavController,
              private alertController: AlertController, 
              private authService : AuthService,
              private appService : AppService) { }

  showAppleSignIn = false;
  user = null;



  async ngOnInit() {

    const { Device } = Plugins;
      // Only show the Apple sign in button on iOS
  
      let device = await Device.getInfo();
      this.showAppleSignIn = device.platform === 'ios';

  }

  openAppleSignIn() {
    const { SignInWithApple } = Plugins;
    SignInWithApple.Authorize()
      .then(async (res) => {
        if (res.response && res.response.identityToken) {
          this.authService.createFirebaseuser(res.response);
          this.navController.navigateRoot("/app/tabs/home");
        } else {
          this.presentAlert();
        }
      })
      .catch((response) => {
        this.presentAlert();
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please try again later',
      buttons: ['OK'],
    });
    await alert.present();
  }

  sigInwithEmail() {
    this.navController.navigateForward("/auth");
  }

  public orderAsGuest() {
    this.appService.showLoading();

    this.authService.signInAsGuest().then(
      (userData) => {
        console.log(userData);
        localStorage.setItem('uid', userData.user.uid);
        this.navController.navigateRoot('/app/tabs/home');
      }
    ).catch(err => {
      if (err) {
        this.appService.showToaster(`${err}`, 2100);
      }}).then(el => this.appService.dismiss());
    }

}
