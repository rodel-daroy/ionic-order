import { Component, OnInit } from '@angular/core';
import { LocationService } from "src/app/services/location.service";
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  public businessInfo: any = {
    address: '',
    phoneNo: '',
    openTime: '',
    closeTime: ''
  };
  public businessLatitude = localStorage.getItem('businessLatitude');
  public businessLongitude = localStorage.getItem('businessLongitude');

  constructor(public locationService: LocationService,
    public appService: AppService) {
  }

  ngOnInit() {
    this.getBusinessDetails();
    this.initMap();
  }

  initMap() {
    try {
      let center = new google.maps.LatLng(parseFloat(this.businessLatitude), parseFloat(this.businessLongitude));

      var map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 16
      });

      var marker = new google.maps.Marker({
        position: center,
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        anchorPoint: new google.maps.Point(0, -29)
      });
      marker.setVisible(true);
    }
    catch (e) {
      console.error(e);
    }
  }

  getBusinessDetails() {
    this.appService.getClientBusinessDetails().valueChanges()
      .subscribe((res: any) => {
        this.businessInfo = res;
      });
  }

}
