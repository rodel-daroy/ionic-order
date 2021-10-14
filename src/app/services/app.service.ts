import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { ConstService } from './constant.service';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  authState: any = null;
  isLoading = false;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    public http: HttpClient,
    private constService: ConstService) {

    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
    });

  }

  getFavorites() {
    return this.afDB.list('menuItems', ref => ref.orderByChild('favorite').equalTo(true));
  }

  getCategories() {
    return this.afDB.list('categories');
  }

  getCategoriesForHome() {
    return this.afDB.list('categories', ref => ref.orderByChild('showOnHome').equalTo(true));
  }

  getMenuItems(categoryId) {
    return this.afDB.list('menuItems', ref => ref.orderByChild('category').equalTo(categoryId));
  }

  getMenuItemDetails(menuItemId) {
    return this.afDB.object('menuItems/' + menuItemId)
  }

  getCoupons() {
    return this.afDB.list('coupons/');
  }

  getAmountSettingData() {
    return this.afDB.object('/settings');
  }

  //address list 

  getAddressList() {
    console.log(Storage.get({ key: 'authData.userId' }));
    return this.afDB.list("/users/" + localStorage.getItem('uid') + "/address")
  }

  getAvailablePincodes() {
    return this.afDB.list("delivery-options");
  }

  deleteAdressById(addressId) {
    return this.afDB.list("/users/" + localStorage.getItem('uid') + "/address/" + addressId).remove();
  }



  //Address 

  addAddress(body) {
    return this.afDB.list("/users/" + localStorage.getItem('uid') + "/address")
      .push(body);
  }

  updateAddressById(addressId, address) {
    return this.afDB.object("/users/" + localStorage.getItem('uid') + "/address/" + addressId).update(address);
  }

  getAddressById(addressId) {
    return this.afDB.object("/users/" + localStorage.getItem('uid') + "/address/" + addressId)
  }



  //crubside orders

  getUserDetailsById() {
    return this.afDB.object("/users/" + localStorage.getItem('uid'));
  }


  //myorders - 

  getOrders() {
    return this.afDB.list("/orders", ref => ref.orderByChild("userId").equalTo(localStorage.getItem('uid')).limitToLast(10));
  }

  getOrderDetailById(orderId) {
    return this.afDB.object("/orders/" + orderId);
  }

  cancelOrder(orderId) {
    var status = { status: "Canceled" };
    return this.afDB.object("/orders/" + orderId).update(status);
  }

  //checkout

  placeOrderData(body) {
    return this.afDB.list("/orders").push(body);
  }


  firebaseURL = 'https://us-central1-sushi-house-2.cloudfunctions.net/payWithStripe';

  makePayment(token, amount, currency) {

    console.log(token);

    const paymentData = {
      amount: amount,
      currency: currency,
      token: token.id
    }
    return new Promise(resolve => {
      this.http
        .post(this.firebaseURL, JSON.stringify(paymentData))
        .subscribe(data => {
          console.log(data);
          resolve(data);
        });
    });
  }

  savePaymentDetails(orderId, paymentDetails) {
    let body = {
      payment: paymentDetails,
      paymentStatus: "Success"
    };
    return this.afDB.object('/orders/' + orderId).update(body);
  }


  //Location 

  getClientBusinessDetails() {
    return this.afDB.object('/business');
  }

  async showLoading(message?) {
    const loader = await this.loadingCtrl.create({
      message: message || 'Please wait..'
    });
    loader.present();
    return loader;
  }

  async showLoading1(message?) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: message || 'Please wait..'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  async showToaster(message, duration?) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration || 3000
    });
    toast.present();
    return toast;
  }

  async showAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async closeLoading() {
    return await this.loadingCtrl.dismiss();
  }

  getSettingsData() {
    return this.afDB.object('settings');
  }



  getUserDetails(uid) {
    return this.afDB.object('users/' + uid);
  }

}
