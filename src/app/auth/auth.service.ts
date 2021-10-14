import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from '../../environments/environment';
import * as firebase from 'firebase';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private afAuth: AngularFireAuth, private afDB: AngularFireDatabase) {}

  async createFirebaseuser(appleResponse)
  {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    
    const credential = provider.credential({
      idToken : appleResponse.identityToken
    });

    console.log('credential: ',credential);
    const userCredential = await this.afAuth.signInWithCredential(credential);
    console.log('After sign in : ', userCredential);
    this.saveUserDetail(userCredential.user.email,userCredential.user.uid, null, appleResponse.givenName);

    this.storeAuthData(userCredential.user.uid, appleResponse.token, userCredential.user.email);
  }

  public signInAsGuest() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInAnonymously().then((data) => {
        resolve(data);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        reject(`login failed ${error.message}`);
        // ...
      });
    });
  }

  saveUserDetail(email: string, userId: string, mobile: string, name: string)
  {

    let data = {
      email: email,
      mobileNo: mobile,
      role: "User"
    }

    if(name){
      data['name'] = name;
    }
      return this.afDB.object("users/" + userId).set(data);

  }

  private storeAuthData(
    userId: string,
    token: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      email: email
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

//fireauth functions

loginAf(email: string, password: string) {
  return this.afAuth.signInWithEmailAndPassword(email, password)
}

createUserAf(email: string, password: string) {
  return this.afAuth.createUserWithEmailAndPassword(email, password)
}

logout() {
  localStorage.removeItem('uid');
  this.afAuth.signOut();
}


}