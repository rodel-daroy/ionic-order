import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LocationService } from "src/app/services/location.service";
import { AppService } from './../../services/app.service';
import { UtilityService } from '../../services/utility.service';
import { NavController } from "@ionic/angular";


@Component({
  selector: "app-pickup-takeout",
  templateUrl: "./pickup-takeout.page.html",
  styleUrls: ["./pickup-takeout.page.scss"],
})
export class PickupTakeoutPage implements OnInit {

  //@ViewChild("search") public searchElementRef: ElementRef;
  deliveryTimeOption: string = null;
  public orderInfo;
  public restaurantAvailable: boolean;
  public address;
  public distance: string;
  public duration: string;
  public currentTime = new Date();
  public deliveryTime = "30";

  public pickupDetails: any = {
    pickupTime: null,
    name: '',
    mobileNo: null
  };

  constructor(public locationService: LocationService, private navCtrl: NavController, private appService: AppService, private utilityService: UtilityService) {
    console.log(this.currentTime);
  }

  async ngOnInit() {
    if (localStorage.getItem("orderInfo"))
      this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));
    this.orderInfo.status = "Pending";
    this.getBusinessDetails(this.orderInfo.restaurantId);
    this.getUserDetails();
  }

  ionViewDidEnter() {
    this.loadMapRoute();
  }

  loadMapRoute() {

    const lat = this.address[0].latitude;
    const long = this.address[0].longitude;

    this.locationService.loadDirectionRouteMapWithCoordinates(lat,long).then((res: any) => {

      console.log(res); // "Success"
      this.distance = res.routes[0].legs[0].distance.text;
      this.duration = res.routes[0].legs[0].duration.text;

    });
  }
  getUserDetails() {
    this.appService.getUserDetailsById().valueChanges().subscribe((response: any) => {
      console.log(response);
      this.pickupDetails.name = response.name;
      this.pickupDetails.mobileNo = response.mobileNo;
      //this.isUpdateMode = true;
    });
  }

  getBusinessDetails(restaurantId) {
    let restaurantData
    if (localStorage.getItem("businessData"))
      restaurantData = JSON.parse(localStorage.getItem("businessData"));
      this.address = restaurantData.filter(restaurant => restaurant.id === restaurantId);
      console.log(this.address);
  }

  checkOut() {

    //new Date(this.currentTime.setTime(new Date().setMinutes(new Date().getMinutes() + Number(this.deliveryTime)))).toISOString();
    console.log(this.pickupDetails);
    if (this.utilityService.checkIfOrderInRestaurantTiming(this.pickupDetails.pickupTime)) {
      if (this.utilityService.checkIfBookingTimeInPast(this.pickupDetails.pickupTime)) {
        console.log(this.orderInfo);
        this.orderInfo.pickupDetails = this.pickupDetails;
        localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));
        this.navCtrl.navigateForward("/app/tabs/cart/checkout");
        //localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));
      }
      else {
        this.appService.showAlert('Check Selected Time', 'Time Selected in Past.');
      }
    }
    else {
      this.appService.showAlert('Check Selected Time', 'Resturant is closed at selected timing.');
    }
  }
}
