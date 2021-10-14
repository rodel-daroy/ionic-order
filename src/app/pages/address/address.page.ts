import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { Plugins } from '@capacitor/core';
import { AppService } from './../../services/app.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage {



  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;

  latitude: number;
  longitude: number;
  zoom: number;
  public addressId: string;
  public isUpdateMode: boolean = false;
  private geoCoder = new google.maps.Geocoder;

  public address: any = {
    name: '',
    streetAddress : '',
    aptNo: '',
    city: '',
    pincode: '',
    mobileNo: null,
    coordinates:{},
    googleAddress: ''
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private appService: AppService) {
    this.activatedRoute.params.subscribe((res: any) => {
      if (res.id != 0) {
        this.addressId = res.id;
        this.getAddressBYId();
      }
    })
  }


  ionViewDidEnter() {
    this.loadMap();
  }

  public async loadMap() {
    if (!this.isUpdateMode) {
      await this.getLocation();
      this.getAddress(this.latitude, this.longitude);
      this.initMap(this.latitude,
        this.longitude);
    }
    else {
      this.initMap(this.address.coordinates.latitude, this.address.coordinates.longitude)
    }
    
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
    console.log('Current', coordinates);
  }

  async getLocation() {
    this.appService.showLoading1();

    try {
      await this.getCurrentPosition().then(() => {
        console.log('lat' + this.latitude);
        console.log('long' + this.longitude);
        this.appService.dismiss();
      })
    }
    catch (e) {
      console.log('error');
      console.log(e);
    }
  }

  public initMap(lat, long) {
    console.log('check log');
    console.log(lat);
    if (!lat || !long) {
      console.log('no location recieved 1');
    }

    let center = new google.maps.LatLng(lat, long);

    var map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 16
    });

    /* const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  */



    var marker = new google.maps.Marker({
      position: center,
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      anchorPoint: new google.maps.Point(0, -29),
      icon: "assets/img/pin.png"
    });

    marker.setVisible(true);

    google.maps.event.addListener(map, 'dragend', (evt) => {
      marker.setPosition(map.getCenter());
      this.latitude = map.getCenter().lat();
      this.longitude = map.getCenter().lng();
      this.getAddress(this.latitude, this.longitude);
    });

    google.maps.event.addListener(map, 'drag', function (evt) {
      marker.setPosition(map.getCenter());
    });
  }


  getAddressBYId() {
    if (this.addressId) {
      this.appService.getAddressById(this.addressId).valueChanges().subscribe((response: any) => {
        this.address = response;
        console.log(response);
        this.isUpdateMode = true;
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address.googleAddress = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }


  onSubmitAddress() {
    //var position = map.getPosition()
    //marker.getPosition()
    //this.address.latitude = this.latitude;
    const mobileNo = this.address.mobileNo + '';
    this.address.coordinates.latitude = this.latitude;
    this.address.coordinates.longitude = this.longitude;

    console.log(this.address);
    if (mobileNo.length === 14) {
      if (this.isUpdateMode) {
        this.appService.updateAddressById(this.addressId, this.address).then(response => {
          this.appService.showToaster('Address updated successfully!');
          this.navCtrl.navigateBack('/app/tabs/cart/address-list');
        }, (error) => {
          console.log(error);
          this.appService.showToaster(error.message);
        });
      } else {
        this.appService.addAddress(this.address).then(() => {
          this.appService.showToaster('Address updated successfully!');
          this.navCtrl.navigateBack('/app/tabs/cart/address-list');
        }, (error) => {
          console.log(error);
          this.appService.showToaster(error.message);
        });
      }
    } else {
      this.appService.showToaster('Enter Valid Mobile Number');
    }

  }
}