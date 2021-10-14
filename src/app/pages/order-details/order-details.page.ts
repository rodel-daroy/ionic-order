import { AppService } from './../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss']
})
export class OrderDetailsPage implements OnInit {
  public orderId: any;
  public orderDetails;
  private review;
  public currency: any;
  public noOfItems: number;

  constructor(
    public appService: AppService,
    private navCtrl: NavController,
    
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(item => {
      this.orderId = item.orderId;
    });
    this.currency = localStorage.getItem('currency');

  }

  async ngOnInit() {
    let loader = await this.appService.showLoading();
    this.appService.getOrderDetailById(this.orderId).valueChanges().subscribe(order => {
      this.orderDetails = order;
      console.log("order data", JSON.stringify(this.orderDetails))
      loader.dismiss();
    }, error => {
      loader.dismiss();
      this.appService.showToaster(error.error.message);
    });
  }



  rate(productId, i) {
    this.navCtrl.navigateForward('/rating;productId=' + productId + ';orderId=' + this.orderId + ';index=' + i);
  }

  trackOrder() {
    this.navCtrl.navigateForward('/order-status;orderId=' + this.orderId);
  }

  buyAgain(productId) {
    this.navCtrl.navigateForward('/product-detail;productId=' + productId);
  }

}

