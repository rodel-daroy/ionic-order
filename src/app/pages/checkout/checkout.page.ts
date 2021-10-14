import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AppService } from './../../services/app.service';

//import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
declare var Stripe;
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  providers: [AppService]
})
export class CheckoutPage implements OnInit {

  //public payPalEnvironmentSandbox = environment.payPalEnvironmentSandbox;
  public publishableKey = environment.publishableKey;

  public orderDetails: any = {};
  public orderInfo;
  public currency;
  public paymentDetails: any = {
    paymentStatus: true
  };
  public stripeCardList: any[] = [];
  public cardInfo: any = {};
  public userId: string;
  public cvc: number;
  public isSaveCard: boolean = false;
  public newCardSelect: boolean = true;
  public selectedCradIndex: any;
  public isCardSelected: boolean = false;

  stripe = Stripe(this.publishableKey);
  card: any;

  public paymentTypes: any = [
    //{ 'default': true, 'type': 'PayPal', 'value': 'paypal', 'logo': 'assets/img/paypal_logo.jpg' },
    { 'default': false, 'type': 'Stripe', 'value': 'stripe', 'logo': 'assets/img/stripe.png' },
    //{ 'default': false, 'type': 'COD', 'value': 'cod', 'logo': '' }
  ];

  constructor(
    public navCtrl: NavController,
    private appService: AppService,
    //public payPal: PayPal,
    //public stripe: Stripe,
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) {
    this.currency = localStorage.getItem('currency');
    if (localStorage.getItem("orderInfo")) this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));
    this.orderInfo.cart = JSON.parse(localStorage.getItem('cartItem'));
    console.log("Order Info data" + JSON.stringify(this.orderInfo))
    console.log(this.orderInfo);
  }

  ngOnInit() {
    this.setupStripe();
    this.orderInfo.paymentOption = 'Stripe';
    this.orderInfo.paymentType = 'Stripe';
    this.orderInfo.orderId = Math.floor(Math.random() * 90000) + 10000;
    this.orderInfo.createdAt = Date.now();
    this.orderInfo.paymentStatus = "Pending";
    this.orderInfo.orderView = true;
    this.orderInfo.statusReading = [
      {
        title: "Pending",
        time: Date.now()
      }
    ];
    this.appService.getUserDetails(localStorage.getItem('uid')).valueChanges().subscribe((res: any) => {
      this.userId = localStorage.getItem('uid');
      this.orderInfo.userId = this.userId;

      if (res == null) {
        this.orderInfo.userDetails = {
          email: "guest@guest.com",
          name: "Guest",
          mobileNo: "Guest Mobile",
          userid: this.userId
        }
      }
      else {
        this.orderInfo.userDetails = {
          email: res.email,
          name: res.name,
          mobileNo: res.mobileNo,
          userid: this.userId
        }
      }
      console.log(this.orderInfo);
    });
  }

  choosePaymentType(paymentType) {
    this.orderInfo.paymentOption = paymentType;
    this.orderInfo.paymentType = paymentType;
    this.paymentDetails.paymentType = paymentType;

    console.log(this.orderInfo);
  }

  setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', { style: style });
    console.log(this.card);
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const loader = await this.appService.showLoading();
      console.log(event)

      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          this.appService.makePayment(result.source, Math.round(this.orderInfo.grandTotal) * 100, 'usd').then((result: any) => {
            if (result.error) {
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              this.paymentDetails.transactionId = result.balance_transaction;
              this.orderInfo.paymentStatus = "Completed";
              this.orderInfo = { ...this.orderInfo, paymentDetails: this.paymentDetails }
              this.appService.placeOrderData(this.orderInfo).then(() => {
                localStorage.removeItem('cartItem');
                loader.dismiss();
                this.navCtrl.navigateRoot('/app/tabs/cart/checkout/thankyou');
              }).catch((error)=>{
                loader.dismiss();
                this.appService.showToaster(error.message);
              });;
            }
          })
        }
      });
    });
  }


}