import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: () => import('../category/category.module').then( m => m.CategoryPageModule)
          },
          {
            path: 'product-list',
            loadChildren: () => import('../product-list/product-list.module').then(m => m.ProductListPageModule)
          },
          {
            path: 'product-detail',
            loadChildren: () => import('../product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
          }
        ]
      },
        
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
          },
          {
            path: 'pickup-takeout',
            loadChildren: () => import('../pickup-takeout/pickup-takeout.module').then( m => m.PickupTakeoutPageModule)
          },
          {
            path: 'curbside-pickup',
            loadChildren: () => import('../curbside-pickup/curbside-pickup.module').then( m => m.CurbsidePickupPageModule)
          },
          {
            path: 'address-list',
            children: [
              {
                path: '',
                loadChildren: () => import('../address-list/address-list.module').then( m => m.AddressListPageModule)
              },
              {
                path: 'address',
                loadChildren: () => import('../address/address.module').then(m => m.AddressPageModule)
              }
            ]
          },
          {
            path: 'checkout',
            
            children: [
              {
                path: '',
                loadChildren: () => import('../checkout/checkout.module').then(m => m.CheckoutPageModule)
              },
              {
                path: 'thankyou',
                loadChildren: () => import('../thankyou/thankyou.module').then( m => m.ThankyouPageModule)
              }
            ]
          }
        ]
      },

      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
          },
          {
            path: 'orders',
            loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
          },
          {
            path: 'privacy',
            loadChildren: () => import('../privacy/privacy.module').then( m => m.PrivacyPageModule)
          },
          {
            path: 'terms',
            loadChildren: () => import('../terms/terms.module').then( m => m.TermsPageModule)
          },
          {
            path: 'location',
            loadChildren: () => import('../location/location.module').then( m => m.LocationPageModule)
          },
          {
            path: 'order-details/:orderId',
            loadChildren: () => import('../order-details/order-details.module').then( m => m.OrderDetailsPageModule)
          }
        
        ]
      },

      {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
