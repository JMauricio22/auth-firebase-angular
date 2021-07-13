import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UserModel } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  user: UserModel;
  rememberMe = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: "Registering User",
      icon: "info",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.authService
      .registerUser(this.user)
      .then((resp) => {
        Swal.close();
        if (this.rememberMe) {
          localStorage.setItem("email", resp.user.email);
        }
        this.router.navigateByUrl("/login");
      })
      .catch((err) => {
        Swal.fire({
          text: "Failed to register user",
          icon: "error",
        });
        console.log(err);
      });
  }
}
