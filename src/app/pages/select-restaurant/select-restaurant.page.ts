import { Component, OnInit } from '@angular/core';
import {UtilityService} from '../../services/utility.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-restaurant',
  templateUrl: './select-restaurant.page.html',
  styleUrls: ['./select-restaurant.page.scss'],
})
export class SelectRestaurantPage implements OnInit {

  public restaurants = [{}];
  public restaurantTimings = {openTiming: '', closeTiming: ''};
  public openTime;
  public closeTime;
  public orderInfo;
  constructor(private utilityService: UtilityService, private navCtrl: NavController) { }

  ngOnInit() {
    if (localStorage.getItem("orderInfo"))
			this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));
    this.getRestaurantDetails();
  }

  getRestaurantDetails(){
    let res =  localStorage.getItem('businessData');
    this.restaurants = JSON.parse(res);
    this.restaurantTimings = JSON.parse(localStorage.getItem('restaurantTimings'));
    console.log(this.restaurantTimings);
    this.openTime = this.utilityService.formatAMPM(new Date(this.restaurantTimings.openTiming));
    this.closeTime = this.utilityService.formatAMPM(new Date(this.restaurantTimings.closeTiming));
  }

  selectRestaurant(restId){
    this.orderInfo.restaurantId = restId;
    localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));
    this.navCtrl.navigateForward('/app/tabs/home'); 
  }

}
