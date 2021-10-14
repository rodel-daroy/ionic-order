import { Component, OnInit } from '@angular/core';

import { AppService } from './../../services/app.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  public menuItems;
  public outOfStockItems;
  public categoryName;
  public menuId: number;
  public itemsCopy = [];
  public outOfStockItemsCopy = [];
  public noOfItems: number = 0;
  public currency;

  constructor(
    private navCtrl: NavController,
    public appService: AppService,
    public activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe(item => {
      this.menuId = item.menuId;
      this.categoryName = item.catName;
      console.log(item);
    });
  }

  ngOnInit() {
    this.getMenuItems();
  }

  ionViewWillEnter() {
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    if (cart != null) {
      this.noOfItems = cart.length;
    }
    else {
      this.noOfItems = 0;
    }
    console.log(this.noOfItems);

    this.currency = localStorage.getItem('currency');
  }



  async getMenuItems() {
    if (this.menuId) {
      await this.appService.getMenuItems(this.menuId).snapshotChanges().subscribe((data: any) => {
        this.menuItems = [];
        this.outOfStockItems = [];
        data.forEach(item => {
          let temp = item.payload.toJSON();
          temp["_id"] = item.payload.key;
          if (temp.outOfStock) { this.outOfStockItems.push(temp) } else { this.menuItems.push(temp); }
        });
        this.itemsCopy = this.menuItems;
        this.outOfStockItemsCopy = this.outOfStockItems;
        console.log("response of product list" + JSON.stringify(this.menuItems))
      }, error => {
        console.log(error);
      })
    } else {
      this.navCtrl.navigateRoot('/app/tabs/home');
    }
  }

  goToCartPage() {
    this.navCtrl.navigateForward('/app/tabs/cart');
  }

  navigateTo(productId) {

    this.navCtrl.navigateForward('/app/tabs/category/product-detail;productId=' + productId);
  }

}
