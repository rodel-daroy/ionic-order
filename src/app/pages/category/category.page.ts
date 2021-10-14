import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  public categories;
  public noOfItemsInCart = 0;

  constructor(
    public appService: AppService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  ionViewWillEnter() {
    let cart = JSON.parse(localStorage.getItem('cartItem'));
    console.log('cart items');
    console.log(cart);
    if (cart != null) {
      this.noOfItemsInCart = cart.length;
    }
    else {
      this.noOfItemsInCart = 0;
    }
  }


  async getCategories() {
    await this.appService.getCategories().snapshotChanges().subscribe(data => {
      this.categories = [];
      data.forEach(item => {
        let temp = item.payload.toJSON();
        temp["_id"] = item.payload.key;
        this.categories.push(temp);
      });
    }, error => {
      console.log(error);
    })
  }


  goToCartPage() {
    this.navCtrl.navigateForward('/app/tabs/cart');
  }

  navigateTo(menuId, title) {
    this.navCtrl.navigateForward('app/tabs/category/product-list;menuId=' + menuId + ';catName=' + title);
  }

}
