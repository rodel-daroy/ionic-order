import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NavController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { UtilityService } from './../../services/utility.service';
import { OrderTypeSelectComponent } from '../order-type-select/order-type-select.component';
import { app } from 'firebase';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



  public favItems = [];
  public noOfItems = 0;
  public currency: any;
  public menuItems;
  public categories;
  public itemsCopy = [];
  public orderInfo;
  public ifRestaurantOpen: boolean;


  constructor(
    public appService: AppService,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public routerOutlet: IonRouterOutlet,
    public utilityService: UtilityService) {

    this.currency = localStorage.getItem('currency');
  }

  ngOnInit() {
    this.presentFilter();
    this.getFavorites();
    this.getCategoriesForHome();
    this.ifRestaurantOpen = (localStorage.getItem("restaurantOpen")==='true');
    if (!this.ifRestaurantOpen) {
      this.appService.showAlert('Restaurant Closed', 'Restaurant is not taking any orders at the moment.');
    }
  }

  ionViewWillEnter() {
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    if (cart != null) {
      this.noOfItems = cart.length;
    }
    else {
      this.noOfItems = 0;
    }
  }


  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: OrderTypeSelectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }


  async getFavorites() {
    await this.appService.getFavorites().snapshotChanges().subscribe((data: any) => {
      this.menuItems = [];
      data.forEach(item => {
        let temp = item.payload.toJSON();
        temp["_id"] = item.payload.key;
        this.menuItems.push(temp);
      });
      this.itemsCopy = this.menuItems.slice(0, 3);
      console.log("response of favorites list" + JSON.stringify(this.menuItems))
    }, error => {
      console.log(error);
    })
  }

  async getCategoriesForHome() {
    await this.appService.getCategoriesForHome().snapshotChanges().subscribe((data: any) => {
      let categoriesForHome = [];
      data.forEach(item => {
        let temp = item.payload.toJSON();
        temp["_id"] = item.payload.key;
        categoriesForHome.push(temp);
      });
      this.categories = categoriesForHome.slice(0, 3);
      console.log("response of category list" + JSON.stringify(this.categories));
      //loader.dismiss();
    }, error => {
      //loader.dismiss();
      console.log(error, 4000);
    })
  }

  goToCartPage() {
    this.navCtrl.navigateForward('/app/tabs/cart');
  }

  navigateTo(productId) {
    this.navCtrl.navigateForward('/app/tabs/category/product-detail;productId=' + productId);
  }

  navigateToOrderTab() {
    this.navCtrl.navigateForward('/app/tabs/category');
  }

  navigateToCategory(categoryId, categoryTitle) {
    this.navCtrl.navigateForward('/app/tabs/category/product-list;menuId=' + categoryId + ';catName=' + categoryTitle)
  }

}