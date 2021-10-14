import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LocationService } from "src/app/services/location.service";
import { AppService } from './../../services/app.service';
import { UtilityService } from '../../services/utility.service';
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-curbside-pickup",
  templateUrl: "./curbside-pickup.page.html",
  styleUrls: ["./curbside-pickup.page.scss"],
})
export class CurbsidePickupPage implements OnInit {

  public pickupDetails: any = {
    pickupTime: null,
    name: '',
    mobileNo: null,
    vehicleModel: '',
    vehicleColor: ''
  };


  //@ViewChild("map") public searchElementRef: ElementRef;
  public orderInfo;
  public address;
  public distance: string;
  public duration: string;
  public pickupTime = new Date();
  public currentTime = new Date();
  public deliveryTime: string = "30";

  constructor(public locationService: LocationService, private navCtrl: NavController, private appService: AppService, private utilityService: UtilityService) {
    this.getUserDetails();
  }

  ngOnInit() {
    if (localStorage.getItem("orderInfo"))
      this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));

    this.orderInfo.status = "Pending";

    this.getAddressDetails(this.orderInfo.restaurantId);

  }

  ionViewDidEnter() {

    const lat = this.address[0].latitude;
    const long = this.address[0].longitude;

    this.locationService.loadDirectionRouteMapWithCoordinates(lat,long).then((res: any) => {

      console.log(res); // "Success"
      this.distance = res.routes[0].legs[0].distance.text;
      this.duration = res.routes[0].legs[0].duration.text;

    });
  }

  /* onDeliveryTimeChange(event) {
    this.deliveryTimeOption = event.detail.value;
  } */

  getUserDetails() {
    this.appService.getUserDetailsById().valueChanges().subscribe((response: any) => {
      console.log(response);
      this.pickupDetails.name = response.name;
      this.pickupDetails.mobileNo = response.mobileNo;
      //this.isUpdateMode = true;
    });
  }

  getAddressDetails(restaurantId) {
    let restaurantData
    if (localStorage.getItem("businessData"))
      restaurantData = JSON.parse(localStorage.getItem("businessData"));
      this.address = restaurantData.filter(restaurant => restaurant.id === restaurantId);
      console.log(this.address);
  }

  checkOut() {

    if (this.utilityService.checkIfOrderInRestaurantTiming(this.pickupDetails.pickupTime)) {
      if (this.utilityService.checkIfBookingTimeInPast(this.pickupDetails.pickupTime)) {
          console.log(this.pickupDetails);

          this.orderInfo.pickupDetails = this.pickupDetails;
          localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));
          this.navCtrl.navigateForward("/app/tabs/cart/checkout");
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
