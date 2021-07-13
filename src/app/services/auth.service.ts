import { Injectable } from "@angular/core";
import firebase from "firebase";
import "firebase/auth";
import { UserModel } from "../models/user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.dist";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  token: string;
  expirationTime: Date;

  constructor(private router: Router) {
    firebase.initializeApp({
      apiKey: environment.apiKey,
      authDomain: environment.authDomain,
      projectId: environment.projectId,
      storageBucket: environment.storageBucket,
      messagingSenderId: environment.messagingSenderId,
      appId: environment.appId,
    });

    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");

    if (token && expirationTime) {
      this.token = token;
      this.expirationTime = new Date(expirationTime);
    }
  }

  registerUser(user: UserModel): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password);
  }

  loginUser(user: UserModel): Promise<any> {
    return firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
  }

  getToken(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          user
            .getIdTokenResult(false)
            .then((resp) => {
              this.expirationTime = new Date(resp.expirationTime);
              this.token = resp.token;
              localStorage.setItem("token", this.token);
              localStorage.setItem(
                "expirationTime",
                this.expirationTime.getTime().toString()
              );
              resolve(true);
            })
            .catch((err) => {
              reject(false);
            });
        } else {
          reject(false);
        }
      });
    });
  }

  isAuthenticated(): boolean | Promise<boolean> {
    if (!this.token) {
      return false;
    }

    if (this.expirationTime >= new Date()) {
      return this.getToken();
    }

    return true;
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        this.token = null;
        this.expirationTime = null;
        this.router.navigateByUrl("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
