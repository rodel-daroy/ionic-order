import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { UtilityService } from './../../services/utility.service';
import { ActionSheetController } from '@ionic/angular';


@Component({
	selector: 'app-cart',
	templateUrl: './cart.page.html',
	styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

	public cartItems = [];
	public subTotalPrice: number;
	public taxAmount: number;
	public serviceChargeAmount: number;
	public grandTotal: number;
	public noOfItems: number = 0;
	public globalTax: number = 0;
	public serviceCharge: number = 0;
	public deliveryCharge: number = 0;
	public currency;
	public coupons;
	public couponDiscount: number = 0;
	public deductedPrice: number;
	public productId: string;
	public menuId: string;

	public orderInfo;
	public ifRestaurantOpen : boolean;

	constructor(public appService: AppService,
		private navCtrl: NavController,
		private authService: AuthService,
		private utilityService: UtilityService,
		public actionSheetController: ActionSheetController) { }

	ngOnInit() {
		if (localStorage.getItem("orderInfo"))
			this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));
	}

	async ionViewWillEnter() {
		this.utilityService.checkIfRestaurantOpen();
		this.ifRestaurantOpen = (localStorage.getItem("restaurantOpen")==='true');
		this.initializeCart();
	}

	async initializeCart() {
		this.currency = localStorage.getItem('currency');
		this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
		console.log('cart items');
		console.log(this.cartItems);
		if (this.cartItems != null) {
			this.noOfItems = this.cartItems.length;
			await this.getCouponsInfo();
			await this.getTaxInfo();
			await this.calculatePrice();
		}
	}

	async getCouponsInfo() {
		await this.appService.getCoupons().valueChanges().subscribe((coupons: any) => {
			this.coupons = coupons;
		})
	}

	async getTaxInfo() {
		await this.appService.getAmountSettingData().valueChanges()
			.subscribe((res: any) => {
				this.globalTax = res.totalVat ? res.totalVat : 0;
				this.serviceCharge = res.servicecharge ? res.servicecharge : 0;
				this.deliveryCharge = res.deliveryCharge ? res.deliveryCharge : 0;
				this.calculatePrice();
			});
	}

	calculatePrice() {
		localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
		this.cartItems = JSON.parse(localStorage.getItem('cartItem'));
		this.noOfItems = this.cartItems.length;
		if (this.cartItems) {
			let subTotal = 0;
			this.cartItems.forEach((data: any) => {
				if (data.item.price.specialPrice != undefined) {
					data.item.itemTotalPrice = data.item.itemQunatity * data.item.price.specialPrice;
				} else {
					data.item.itemTotalPrice = data.item.itemQunatity * data.item.price.value;
				}
				subTotal = subTotal + data.item.itemTotalPrice + data.extraPrice;
			});
			this.subTotalPrice = Number(subTotal.toFixed(2));
			this.taxAmount = Number(((this.globalTax / 100) * this.subTotalPrice).toFixed(2));
			this.deductedPrice = Number((this.couponDiscount / 100 * this.subTotalPrice).toFixed(2));

			if (this.subTotalPrice <= 10) {
				this.serviceChargeAmount = 0.50;
			}
			else if (this.subTotalPrice > 10 && this.subTotalPrice <= 20) {
				this.serviceChargeAmount = 0.75;
			}
			else if (this.subTotalPrice > 20) {
				this.serviceChargeAmount = 1;
			}

			//this.serviceChargeAmount = Number(((this.serviceCharge / 100) * this.subTotalPrice).toFixed(2));

			this.subTotalPrice = this.subTotalPrice - this.deductedPrice;
			this.grandTotal = Number((this.subTotalPrice + this.taxAmount + this.serviceChargeAmount).toFixed(2));

			if (this.orderInfo.orderType == 'Delivery') {
				this.grandTotal = Number((this.grandTotal + this.deliveryCharge).toFixed(2));
			}
		}

		//localStorage.setItem('orderInfo', btoa(JSON.stringify(amountDetails)));
		this.orderInfo.grandTotal = this.grandTotal;
		this.orderInfo.subTotal = this.subTotalPrice;
		this.orderInfo.tax = this.taxAmount;
		this.orderInfo.serviceCharge = this.serviceChargeAmount;
		this.orderInfo.couponDiscount = this.couponDiscount;
		this.orderInfo.deductedPrice = this.deductedPrice;

		console.log(this.orderInfo);

		localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
	}

	removeCartItem(index) {
		this.cartItems.splice(index, 1);
		this.calculatePrice();
	}

	repeatLastItem(productIndex) {
		  this.cartItems[productIndex].item.itemQunatity = this.cartItems[productIndex].item.itemQunatity + 1;
		  this.calculatePrice();
	  }

	  async createActionSheet(index) {
		const actionSheet = await this.actionSheetController.create({
		  header: this.cartItems[index].item.title,
		  buttons: [{
			text: 'Repeat Same',
			icon: 'refresh',
			handler: () => {
			  this.repeatLastItem(index);
			}
		  }, {
			text: 'Customize',
			icon: 'menu',
			handler: () => {
				this.navCtrl.navigateForward('/app/tabs/category/product-detail;productId=' + this.cartItems[index].item.itemId);
			}
		  }, {
			text: 'Cancel',
			icon: 'close',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  }
		  ]
		});
	
		await actionSheet.present();
	  }
	

	increaseCartItem(index) {
		this.createActionSheet(index);
		this.calculatePrice();
	}

	decreaseCartItem(index) {
		if (this.cartItems[index].item.itemQunatity > 1) {
			this.cartItems[index].item.itemQunatity = this.cartItems[index].item.itemQunatity - 1;
		}
		this.calculatePrice();
	}

	saveOrderInfo() {
		localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));

		if (this.orderInfo.orderType == 'Curbside')
			this.navCtrl.navigateForward('/app/tabs/cart/curbside-pickup');
		else if (this.orderInfo.orderType == 'Takeout')
			this.navCtrl.navigateForward('/app/tabs/cart/pickup-takeout');
		else
			this.navCtrl.navigateForward('/app/tabs/cart/address-list');
	}



	goToCartPage() {
		this.navCtrl.navigateForward('/app/tabs/cart');
	}

	navigateHome() {
		this.navCtrl.navigateRoot("/app/tabs/home");
	}


}
