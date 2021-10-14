import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AppService } from "./../../services/app.service";

@Component({
  selector: "app-address-list",
  templateUrl: "./address-list.page.html",
  styleUrls: ["./address-list.page.scss"],
})
export class AddressListPage implements OnInit {
  public addressList;
  public orderInfo;
  public orderInfoCopy;
  public pincodes;
  public currency;
  private isPincodeAvailable: boolean = false;

  constructor(private navCtrl: NavController, public appService: AppService) {}

  async ngOnInit() {
    this.currency = localStorage.getItem("currency");
    if (localStorage.getItem("orderInfo"))
      this.orderInfo = JSON.parse(atob(localStorage.getItem("orderInfo")));
    this.orderInfoCopy = JSON.parse(JSON.stringify(this.orderInfo));

    await this.appService
      .getAddressList()
      .snapshotChanges()
      .subscribe(
        (data: any) => {
          this.addressList = [];
          data.forEach((item) => {
            let temp = item.payload.toJSON();
            temp["_id"] = item.payload.key;
            this.addressList.push(temp);
          });
        },
        (error) => {
          console.log(error);
        }
      );

    await this.appService
      .getAvailablePincodes()
      .valueChanges()
      .subscribe(
        (result: any) => {
          this.pincodes = result;
        },
        (error) => {
          console.log(error);
        }
      );

    this.orderInfo.status = "Pending";
  }

  async deleteAdress(id, index) {
    let loader = await this.appService.showLoading();
    console.log(id);
    this.appService
      .deleteAdressById(id)
      .then(() => {
        loader.dismiss();
        this.appService.showToaster("Address Deleted");
      })
      .catch((error) => {
        loader.dismiss();
        console.log(error);
      });
  }

  editAdress(id) {
    this.navCtrl.navigateForward("/app/tabs/cart/address-list/address;id=" + id);
  }

  addAddress() {
    this.navCtrl.navigateForward("/app/tabs/cart/address-list/address;id=" + 0);
  }

  selectAddress(address) {
    let availablePins = "";
    this.orderInfo.shippingAddress = address;
    
    if (this.pincodes && this.pincodes.length > 0) {
      this.pincodes.forEach((pin, i) => {
        availablePins = availablePins + pin.pincode + ", ";
        if (pin.pincode == address.pincode) {
          this.isPincodeAvailable = true;
        }
        if (i == this.pincodes.length - 1 && !this.isPincodeAvailable) {
          this.appService.showAlert('Pincode Unservicable!',
            "Delivery is available to these pincodes only (" +
              availablePins.slice(0, availablePins.length - 2) +
              ") !!"
          );
        }
      });
    }
  }

  checkOut() {
    if (this.isPincodeAvailable) {
      if (this.orderInfo.shippingAddress != null) {
        localStorage.setItem("orderInfo", btoa(JSON.stringify(this.orderInfo)));
        this.navCtrl.navigateForward("/app/tabs/cart/checkout");
      } else {
        this.appService.showToaster("Please select address first!");
      }
    } else {
      this.appService.showToaster("Please select/change address first!");
    }
  }
}
