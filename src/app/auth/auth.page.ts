import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService, AuthResponseData } from './auth.service';
import {AppService} from '../services/app.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private appServie: AppService
  ) { }

  ngOnInit() {
  }

  public async onLogin(email: string, password: string) {
    const loader = await this.appServie.showLoading();

    this.authService.loginAf(email, password).then((res: any) => {
      localStorage.setItem('uid', res.user.uid);
      loader.dismiss();
      this.appServie.showToaster('Login Successful!');
      this.navCtrl.navigateRoot('/app/tabs/home');
    }).catch(error => {
      loader.dismiss();
      const code = error.code;
      console.log(error);
      console.log(code);
      let message = 'Could not log in, please try again.';
      if (code === 'auth/user-not-found'){
        message = 'This email address exists already!';
      }
      else if (code === 'auth/wrong-password'){
        message = 'This password is not correct.';
      }
      this.showAlert(message);
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.onLogin(email,password);
    form.reset();
  }

  navigateToRegisterPage() {
    this.router.navigateByUrl('/auth/register');
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
