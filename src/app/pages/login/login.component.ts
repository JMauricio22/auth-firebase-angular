import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserModel } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: UserModel;
  rememberMe = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
    const email = localStorage.getItem("email");
    if (email) {
      this.rememberMe = true;
      this.user.email = email;
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: "Wait...",
      icon: "info",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.authService
      .loginUser(this.user)
      .then((resp) => {
        console.log(resp);
        if (this.rememberMe) {
          localStorage.setItem("email", resp.user.email);
        }
        return this.authService.getToken();
      })
      .then(() => {
        Swal.close();
        this.router.navigateByUrl("/home");
      })
      .catch((err) => {
        Swal.fire({
          text: "Athentication Error",
          icon: "error",
        });
        console.log(err);
      });
  }
}
