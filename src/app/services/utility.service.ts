import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { AppService } from './app.service';
import { ConstService } from './constant.service';
import { error } from 'selenium-webdriver';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private appService: AppService) { }

  public checkIfRestaurantOpen() {

    this.appService.getClientBusinessDetails().valueChanges().subscribe((res: any) => {
      if (res) {
        if (res.restaurantClosed) {
          localStorage.setItem('restaurantOpen', 'false');
        }
        else {
          let currentTime = new Date();
          let restaurantOpenTime = new Date();
          let restaurantCloseTime = new Date();
          let openTime = res.openTime.split(':');
          let closeTime = res.closeTime.split(':');

          restaurantOpenTime.setHours(parseInt(openTime[0]), parseInt(openTime[1]), 0);
          restaurantCloseTime.setHours(parseInt(closeTime[0]), parseInt(closeTime[1]), 0);

          localStorage.setItem('restaurantTimings', JSON.stringify({ openTiming: restaurantOpenTime, closeTiming: restaurantCloseTime }));

          if (new Date(currentTime) > restaurantOpenTime && new Date(currentTime) < restaurantCloseTime) {
            localStorage.setItem('restaurantOpen', 'true');
          } else {
            localStorage.setItem('restaurantOpen', 'false');
          }
        }
      }
      else {
        return false;
      }
    });
  }


  public checkIfOrderInRestaurantTiming(time) {
    let localStrRestTime = localStorage.getItem('restaurantTimings');
    let restaurantTimings = JSON.parse(localStrRestTime);
    let openTime = new Date(restaurantTimings.openTiming);
    let closeTime = new Date(restaurantTimings.closeTiming);
    let pickupTime = new Date(time);

    if (pickupTime > openTime && pickupTime < closeTime) {
      return true;
    }
    else { return false; }
  }

  public checkIfBookingTimeInPast(time) {
    let pickupTime = new Date(time);

    if (new Date() < pickupTime) {
      return true;
    }
    else {
      return false;
    }
  }


  public camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  public formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  

}