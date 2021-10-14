import { Component, OnInit } from "@angular/core";
import { AppService } from "./../../services/app.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.page.html",
  styleUrls: ["./product-detail.page.scss"],
})
export class ProductDetailPage {
  public count: number = 1;


  public product: any = {
    name: "",
    sizeOption: {},
    extraOption: [],
    selectionMenuOption: [{ name: "", items: [] }]
  };

  public cartItems = [];
  public productDetails: any = {};
  public menuSelections;
  private productId: any;
  public currency: any;
  public noOfItems: number = 0;
  public productCount: number = 0;
  private selectedSize: string;
  public price: number = 0;
  public specialInstruction: string;

  public pname: string;

  constructor(
    private navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public appService: AppService,
    public actionSheetController: ActionSheetController
  ) {
    this.activatedRoute.params.subscribe((id) => {
      if (id.productId) {
        this.productId = id.productId;
        console.log("productId", id.productId);
        this.getMenuItemDetails(id.productId);
      } else {
        this.navCtrl.navigateRoot("/home");
      }
    });
    this.currency = localStorage.getItem("currency");
  }


  ionViewWillEnter() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItem"));
    console.log(this.cartItems);
    if (this.cartItems != null) {
      this.noOfItems = this.cartItems.length;
    }
    else {
      this.noOfItems = 0;
    }
    this.getProductCount();
    console.log(this.noOfItems);
  }

  getProductCount() {
    this.productCount = 0;
    console.log(this.productId);
    this.cartItems.forEach(cartItem => {
      if (cartItem.item.itemId === this.productId) {
        this.productCount = this.productCount + Number(cartItem.item.itemQunatity);
      }
    });
  }

  async getMenuItemDetails(productId) {
    this.appService
      .getMenuItemDetails(productId)
      .valueChanges()
      .subscribe(
        (res: any) => {
          this.productDetails = res;
          this.productDetails._id = this.productId;
          this.menuSelections = this.productDetails.menuSelections;
          console.log("menu" + JSON.stringify(this.menuSelections));
          console.log("product detail" + JSON.stringify(this.productDetails));
          this.product = {
            productId: this.productDetails._id,
            name: this.productDetails.title,
            imageUrl: this.productDetails.thumb,
            ratingFlag: 0,
            rating: 0,
            sizeOption: {},
            extraOption: [],
            selectionMenuOption: []
          };
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onCheckExtraIngredients(option, e) {
    console.log(e);
    if (
      this.product.extraOption.findIndex(
        (extraOption) => option.name == extraOption.name
      ) == -1
    ) {
      this.product.extraOption.push(option);
    } else {
      this.product.extraOption.splice(
        this.product.extraOption.findIndex(
          (extraOption) => option.name == extraOption.name
        ),
        1
      );
    }
  }

  onCheckMultipleSelect(selectedOption, menuName) {
    //console.log(selectedOption,menuName);
    //let selectionName = this.utilityService.camelize(menuName);

    if (
      this.product.selectionMenuOption.findIndex(
        (menuOption) => menuName == menuOption.name
      ) == -1
    ) {
      let selectionItem = { name: menuName, items: [selectedOption] }
      this.product.selectionMenuOption.push(selectionItem);
      console.log('yay first')
    }
    else {
      let indexOfSelectionMenu =
        this.product.selectionMenuOption.findIndex(
          (menuOption) => menuName == menuOption.name);
      console.log('index- ' + indexOfSelectionMenu);
      if (this.product.selectionMenuOption[indexOfSelectionMenu].items.findIndex((option) => selectedOption.name == option.name) == -1) {
        this.product.selectionMenuOption[indexOfSelectionMenu].items.push(selectedOption);
      }
      else {
        this.product.selectionMenuOption[indexOfSelectionMenu].items.splice(this.product.selectionMenuOption[indexOfSelectionMenu].items.findIndex(
          (extraOption) => selectedOption.name == extraOption.name
        ),
          1
        );
      }

    }
    console.log(this.product.selectionMenuOption);
  }

  onSelectSize(event) {
    let price = event.detail.value;
    this.product.sizeOption = price;
    this.selectedSize = price.pname;
    console.log(price);
  }
/* 
  addToCart1(productId) {
    console.log(
      "product id----------size-------",
      productId,
      this.selectedSize
    );
    console.log("product size..............");
    console.log(this.product.sizeOption);
    console.log(this.product.sizeOption && this.product.sizeOption.value);
    console.log("------------------------");
    if (this.product.sizeOption && this.product.sizeOption.value) {
      let cart = JSON.parse(localStorage.getItem("cartItem"));
      if (cart == null) {
        cart = [];
        this.performAddOperation(cart, productId);
      } else {
        if (
          cart.findIndex(
            (product) =>
              productId == product.item.itemId &&
              this.selectedSize == product.item.price.pname
          ) == -1
        ) {
          this.performAddOperation(cart, productId);
        } else {
          console.log("else part ");
          const index = cart.findIndex(
            (product) =>
              productId == product.item.itemId &&
              this.selectedSize == product.item.price.pname
          );
          // cart.splice(cart.findIndex(product => (productId == product.item.itemId) && (this.selectedSize == product.item.price.pname)) != -1, 1);
          cart.splice(index, 1);
          console.log('cart after plus ' + cart);
          this.performAddOperation(cart, productId);
        }
      }
    } else {
      this.appService.showToaster("Please Select The Size & Price");
    }
  }

  performAddOperation1(cart, productId) {
    console.log("perform-------", productId);

    let productData: any = {
      item: {
        itemId: productId,
        itemQunatity: this.count,
        price: this.product.sizeOption,
        extraOption: this.product.extraOption,
        selectionMenuOption: this.product.selectionMenuOption,
        thumb: this.productDetails.thumb,
        title: this.productDetails.title,
        specialInstruction: this.specialInstruction
      },
      itemTotalPrice: null,
      extraPrice: null,
    };
    // this.product.Quantity = this.count;
    let preExtraPrice = 0;
    this.product.extraOption.forEach((option) => {
      preExtraPrice = preExtraPrice + Number(option.value);
    });

    this.product.selectionMenuOption.forEach((option) => {
      option.items.forEach((item) => { preExtraPrice = preExtraPrice + Number(item.price); })
    });

    console.log("product sepecial price ", this.product.sizeOption.specialPrice);

    if (this.product.sizeOption.specialPrice != undefined) {
      productData.itemTotalPrice =
        this.count * this.product.sizeOption.specialPrice;
    } else {
      productData.itemTotalPrice = this.count * this.product.sizeOption.value;
    }
    productData.extraPrice = preExtraPrice;
    cart.push(productData);
    console.log("Cart Data" + JSON.stringify(cart));

    // this.product.extraPrice = preExtraPrice;
    // cart.push(this.product);
    this.noOfItems = cart.length;
    localStorage.setItem("cartItem", JSON.stringify(cart));
    //this.navCtrl.navigateForward("/app/tabs/cart");
  } */


  addToCart(productId) {
    console.log(
      "product id----------size-------",
      productId,
      this.selectedSize
    );
    console.log("product size..............");
    console.log(this.product.sizeOption);
    console.log(this.product.sizeOption && this.product.sizeOption.value);
    console.log("------------------------");
    if (this.product.sizeOption && this.product.sizeOption.value) {
      if (this.cartItems == null) {
        this.cartItems = [];
        this.performAddOperation(productId);
      } else {

        let selectedIndexInCart = this.cartItems.findIndex(
          (product) =>
            productId == product.item.itemId &&
            this.selectedSize == product.item.price.pname &&
            JSON.stringify(this.product.extraOption) === JSON.stringify(product.item.extraOption) &&
            JSON.stringify(this.product.selectionMenuOption) === JSON.stringify(product.item.selectionMenuOption)
        )

        if (selectedIndexInCart === -1) {
          this.performAddOperation(productId);
        }
        else {
          this.increaseItemQuantity(selectedIndexInCart);
        }
      }
    } else {
      this.appService.showToaster("Please Select The Size & Price");
    }
  }

  performAddOperation(productId) {
    console.log("perform-------", productId);

    let productData: any = {
      item: {
        itemId: productId,
        itemQunatity: this.count,
        price: this.product.sizeOption,
        extraOption: this.product.extraOption,
        selectionMenuOption: this.product.selectionMenuOption,
        thumb: this.productDetails.thumb,
        title: this.productDetails.title,
        specialInstruction: this.specialInstruction
      },
      itemTotalPrice: null,
      extraPrice: null,
    };
    // this.product.Quantity = this.count;
    let preExtraPrice = 0;
    this.product.extraOption.forEach((option) => {
      preExtraPrice = preExtraPrice + Number(option.value);
    });

    this.product.selectionMenuOption.forEach((option) => {
      option.items.forEach((item) => { preExtraPrice = preExtraPrice + Number(item.price); })
    });

    console.log("product sepecial price ", this.product.sizeOption.specialPrice);

    if (this.product.sizeOption.specialPrice != undefined) {
      productData.itemTotalPrice =
        this.count * this.product.sizeOption.specialPrice;
    } else {
      productData.itemTotalPrice = this.count * this.product.sizeOption.value;
    }
    productData.extraPrice = preExtraPrice;
    this.cartItems.push(productData);
    console.log("Cart Data" + JSON.stringify(this.cartItems));

    // this.product.extraPrice = preExtraPrice;
    // cart.push(this.product);
    this.noOfItems = this.cartItems.length;
    localStorage.setItem("cartItem", JSON.stringify(this.cartItems));
    this.navCtrl.navigateForward("/app/tabs/cart");
  }



  saveCartItemsToLocalStorage() {
    localStorage.setItem("cartItem", JSON.stringify(this.cartItems));
  }

  decreaseCartItem(index) {
    if (this.cartItems[index].item.itemQunatity > 1) {
      this.cartItems[index].item.itemQunatity = this.cartItems[index].item.itemQunatity - 1;
    }
    //this.updateCartItems();
  }

  increaseItemQuantity(index) {
    if (index !== -1) {
      this.cartItems[index].item.itemQunatity = this.cartItems[index].item.itemQunatity + 1;
      this.saveCartItemsToLocalStorage();
      this.navCtrl.navigateForward("/app/tabs/cart");
    }
  }


  updateCartItems() {
    localStorage.setItem('cartItem', JSON.stringify(this.cartItems));
  }

  goToCartPage() {
    this.navCtrl.navigateForward("/app/tabs/cart");
  }

}
