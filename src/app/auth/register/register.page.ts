import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService } from './../auth.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService,
    private alertCtrl: AlertController,
    private navController: NavController,
    private appServie: AppService) { }

  ngOnInit() {
  }

  async onRegister(email: string, password: string, name: string, mobile: string) {
    let loader = await this.appServie.showLoading();
    this.authService.createUserAf(email, password).then((success: any) => {
      this.authService.saveUserDetail(success.user.email, success.user.uid, mobile, name).then((res: any) => {
        console.log(res)
        localStorage.setItem('uid', success.user.uid);
        loader.dismiss();
        this.appServie.showToaster('Registration successful!');
        this.navController.navigateRoot('/app/tabs/home');
      }).catch(error => {
        loader.dismiss();
        this.appServie.showToaster('Registration Failed');
      })
    }).catch(error => {
      loader.dismiss();
      this.appServie.showToaster('Registration Failed');
    })
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    const mobile = form.value.mobile;

    this.onRegister(email, password, name, mobile);
    form.reset();
  }

}
