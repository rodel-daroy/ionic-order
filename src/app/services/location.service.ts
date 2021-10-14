import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MapsAPILoader } from '@agm/core';
import { Platform, AlertController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
const { Geolocation } = Plugins;

import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    // private geoCoder;

    public searchElementRef: ElementRef;
    public currentLocationCoordinates: LocationCoordinates;
    public defaultLocation: LocationCoordinates;
    latitude: number;
    longitude: number;

    constructor(private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private platform: Platform,
        private diagnostic: Diagnostic,
        private alertCtrl: AlertController,
        public appService: AppService) {
        //this.getDefaultLocationCoordinates();
        this.getLocation();
    }


    async getLocation() {
        const position = await Geolocation.getCurrentPosition();
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('lat' + this.latitude);
        console.log('long' + this.longitude);
    }

    public loadMapDefaultLocation() {

        return new Promise(async (resolve, reject) => {
            this.platform.ready().then(() => {
                this.mapsAPILoader.load().then(async () => {
                    try {

                        var loc = { lat: parseFloat(localStorage.getItem('businessLatitude').toString()), lng: parseFloat(localStorage.getItem('businessLongitude').toString()) };

                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: loc,
                            zoom: 13
                        });

                        var marker = new google.maps.Marker(
                            {
                                position: loc,
                                map: map,
                                animation: google.maps.Animation.DROP,
                                anchorPoint: new google.maps.Point(0, -29),
                                icon: "assets/img/pin.png"
                            });

                            marker.setVisible(true);



                    } catch (e) {
                        console.error(e.message)
                        reject("error")
                    }
                });
            });
        });
    }

    public loadDirectionRouteMap() {

        return new Promise(async (resolve, reject) => {
            this.platform.ready().then(() => {
                this.mapsAPILoader.load().then(async () => {
                    try {
                        var directionsService = new google.maps.DirectionsService();
                        var directionsRenderer = new google.maps.DirectionsRenderer();

                        var loc = { lat: parseFloat(localStorage.getItem('businessLatitude').toString()), lng: parseFloat(localStorage.getItem('businessLongitude').toString()) };

                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: loc,
                            zoom: 13
                        });

                        directionsRenderer.setMap(map);

                        /*   var marker = new google.maps.Marker(
                              {position: loc, 
                              map: map,
                              animation: google.maps.Animation.DROP,
                              anchorPoint: new google.maps.Point(0, -29),
                              icon: "assets/img/pin.png"}); */


                        resolve(this.calculateAndDisplayRoute(directionsService, directionsRenderer));

                    } catch (e) {
                        console.error(e.message)
                        reject("error")
                    }
                });
            });
        });
    }

    public loadDirectionRouteMapWithCoordinates(lat, long) {

        return new Promise(async (resolve, reject) => {
            this.platform.ready().then(() => {
                this.mapsAPILoader.load().then(async () => {
                    try {
                        var directionsService = new google.maps.DirectionsService();
                        var directionsRenderer = new google.maps.DirectionsRenderer();

                        var loc = { lat: parseFloat(lat), lng: parseFloat(long) };

                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: loc,
                            zoom: 13
                        });

                        directionsRenderer.setMap(map);

                        /*   var marker = new google.maps.Marker(
                              {position: loc, 
                              map: map,
                              animation: google.maps.Animation.DROP,
                              anchorPoint: new google.maps.Point(0, -29),
                              icon: "assets/img/pin.png"}); */


                        resolve(this.calculateAndDisplayRouteWithLoc(directionsService, directionsRenderer, loc));

                    } catch (e) {
                        console.error(e.message)
                        reject("error")
                    }
                });
            });
        });
    }

    public calculateAndDisplayRoute(
        directionsService: google.maps.DirectionsService,
        directionsRenderer: google.maps.DirectionsRenderer
    ) {
        return new Promise(async (resolve, reject) => {

            try {
                var loc = { lat: parseFloat(localStorage.getItem('businessLatitude').toString()), lng: parseFloat(localStorage.getItem('businessLongitude').toString()) };

                const id = Geolocation.watchPosition({ timeout: 5000, enableHighAccuracy: true }, (position, err) => {
                    if (err) {
                        this.currentLocationCoordinates = this.defaultLocation;
                    } else {
                        var userLoc = { lat: position.coords.latitude, lng: position.coords.longitude };

                        var request = {
                            origin: userLoc,
                            destination: loc,
                            travelMode: google.maps.TravelMode.DRIVING
                        };

                        directionsService.route(request, function (result, status) {
                            if (status == 'OK') {
                                directionsRenderer.setDirections(result);
                                resolve(result);
                            }
                        });

                    }
                    Geolocation.clearWatch({ id });
                });
            }
            catch (e) {
                console.error(e.message)
                reject("error")
            }
        });
    }

    public calculateAndDisplayRouteWithLoc(
        directionsService: google.maps.DirectionsService,
        directionsRenderer: google.maps.DirectionsRenderer,loc
    ) {
        return new Promise(async (resolve, reject) => {

            try {
                //var loc = { lat: parseFloat(localStorage.getItem('businessLatitude').toString()), lng: parseFloat(localStorage.getItem('businessLongitude').toString()) };

                const id = Geolocation.watchPosition({ timeout: 5000, enableHighAccuracy: true }, (position, err) => {
                    if (err) {
                        this.currentLocationCoordinates = this.defaultLocation;
                    } else {
                        var userLoc = { lat: position.coords.latitude, lng: position.coords.longitude };

                        var request = {
                            origin: userLoc,
                            destination: loc,
                            travelMode: google.maps.TravelMode.DRIVING
                        };

                        directionsService.route(request, function (result, status) {
                            if (status == 'OK') {
                                directionsRenderer.setDirections(result);
                                resolve(result);
                            }
                        });

                    }
                    Geolocation.clearWatch({ id });
                });
            }
            catch (e) {
                console.error(e.message)
                reject("error")
            }
        });
    }


    public async loadMap() {
        await this.getLocation();
        this.initMap(this.latitude,
            this.longitude);
    }

    public initMap(lat, long) {

        if (!lat || !long) {
            console.log('no location recieved');
        }

        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: parseFloat(lat), lng: parseFloat(long) },
            zoom: 16
        });

        const input = document.getElementById("pac-input") as HTMLInputElement;
        const searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


        let latLng = new google.maps.LatLng(lat, long);
        let markers: google.maps.Marker[] = [];

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            anchorPoint: new google.maps.Point(0, -29),
            icon: "assets/img/pin.png"
        });



        marker.setVisible(true);

        google.maps.event.addListener(marker, 'dragend', function (evt) {

            this.latitude = evt.latLng.lat().toFixed(4);
            this.longitude = evt.latLng.lng().toFixed(4);

            map.setCenter(this.getPosition());
            marker.setMap(map);

        });

        google.maps.event.addListener(marker, 'drag', function (evt) {
            map.setCenter(this.getPosition());
            marker.setMap(map);
        });

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
        
            if (places.length == 0) {
              return;
            }
        
            // Clear out the old markers.
            markers.forEach((marker) => {
              marker.setMap(null);
            });
            markers = [];
        
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }
              const icon = {
                url: place.icon as string,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
              };
        
              // Create a marker for each place.
              markers.push(
                new google.maps.Marker({
                  map,
                  icon,
                  title: place.name,
                  position: place.geometry.location,
                })
              );
        
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });
    }

    public async checkLocationEnabled() {
        let isLocationEnabled = await this.diagnostic.isLocationEnabled();
        if (!isLocationEnabled) {
            this.presentLocationSericeAlert("device");
        }
        else
            return true;
    }


    public async presentLocationSericeAlert(status) {

        let message = 'Location Service must be enabled in order to get current position. Please enable location access';
        if (this.platform.is('android'))
            message = 'Location Service must be enabled in order to get current position. Please enable GPS location and give the location permissions from App-level permissions';

        const alert = await this.alertCtrl.create({
            header: 'Location Service Disabled',
            message: message,
            buttons: [
                {
                    text: 'Settings',
                    handler: () => {
                        this.diagnostic.switchToLocationSettings();
                    }
                }
            ],
            backdropDismiss: false
        });
        await alert.present();
    }
}

export class LocationCoordinates {
    constructor(latitude: number, longitude: number, address: string, isDefault: boolean) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.isDefault = isDefault;
    }

    latitude: number;
    longitude: number;
    address: string;
    isDefault: boolean;
}
